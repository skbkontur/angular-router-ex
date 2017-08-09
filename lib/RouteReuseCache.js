import { Inject, Injectable, InjectionToken } from "@angular/core";
import { Router } from "./Router";
import { NavigationEnd, NavigationStart } from "./RouteEvents";
import { ReuseRouteStrategy } from "./Config";
import { LocationStrategy } from "@angular/common";
import { RouterScrollWrapper } from "./RouterScrollWrapper";
export var REUSE_CACHE_CONSTRAINT = new InjectionToken("Router reuse cache constraint");
var RouteReuseCache = (function () {
    function RouteReuseCache(router, constraint, location, scrollWrapper) {
        var _this = this;
        this.router = router;
        this.location = location;
        this.cache = window["_cache"] = [];
        this.newRouteNavigations = [];
        this.constraint = constraint;
        if (location.getCurrentPageId) {
            router.events.subscribe(function (e) {
                if (e instanceof NavigationEnd) {
                    _this.currentCacheItem = _this.ensureCache(e.activatedComponent, e.routeContext);
                    if (!_this.lastRouteConfig || _this.lastRouteConfig !== e.routeContext.route) {
                        _this.newRouteNavigation();
                        _this.lastRouteConfig = e.routeContext.route;
                    }
                }
                else if (e instanceof NavigationStart) {
                    if (_this.currentCacheItem) {
                        _this.currentCacheItem.scrollState = scrollWrapper.getScrollState();
                    }
                }
            });
        }
        else {
            console.warn("Router will not reuse routes because your app use custom LocationStrategy which not provide information about page id");
        }
    }
    RouteReuseCache.prototype.getForCurrentPage = function (cmpType) {
        var cacheItems = this.cache.filter(function (c) { return c.ref.componentType === cmpType; });
        if (!cacheItems.length) {
            return undefined; // no cache
        }
        var pageId = this.getCurrentPageId();
        for (var _i = 0, cacheItems_1 = cacheItems; _i < cacheItems_1.length; _i++) {
            var cacheItem = cacheItems_1[_i];
            if (cacheItem.pageIds) {
                //cache back
                if (cacheItem.hasPageId(pageId)) {
                    return cacheItem;
                }
                continue;
            }
            return cacheItem; // sticky
        }
        return undefined;
    };
    RouteReuseCache.prototype.getCacheFor = function (ref) {
        return this.cache.find(function (c) { return c.ref === ref; });
    };
    RouteReuseCache.prototype.ensureCache = function (component, routeCtx) {
        if (!component.instance.reuseRouteStrategy) {
            return undefined; // not a reusable component
        }
        var cacheBack = component.instance.reuseRouteStrategy === ReuseRouteStrategy.CACHEBACK;
        var pageId = this.getCurrentPageId();
        if (!pageId) {
            return undefined; // history api may not supoprted
        }
        var result;
        if (cacheBack) {
            var existCacheItems = this.cache.filter(function (c) { return c.ref.componentType === component.componentType; });
            for (var _i = 0, existCacheItems_1 = existCacheItems; _i < existCacheItems_1.length; _i++) {
                var cacheItem = existCacheItems_1[_i];
                if (cacheItem.ref.instance === component.instance) {
                    cacheItem.addPageId(pageId);
                    return cacheItem;
                }
            }
            result = new ReuseCacheItem(component, routeCtx, pageId);
            this.cache.push(result);
        }
        else {
            var existsSticky = this.cache.some(function (c) { return c.ref.componentType === component.componentType; });
            if (!existsSticky) {
                result = new ReuseCacheItem(component, routeCtx);
                this.cache.push(result);
            }
        }
        return result;
    };
    RouteReuseCache.prototype.newRouteNavigation = function () {
        // removes cache which out of constraint
        this.newRouteNavigations.push(this.getCurrentPageId());
        if (this.newRouteNavigations.length > this.constraint.maxHistoryCacheDepth + 1 /* include current navigation */) {
            this.newRouteNavigations.shift();
        }
        var cacheItemsToDrop = [], stickyRoutesUsed = 0;
        var _loop_1 = function (cacheItem) {
            if (cacheItem.reuseStrategy === ReuseRouteStrategy.CACHEBACK) {
                if (this_1.newRouteNavigations.every(function (n) { return !cacheItem.hasPageId(n); })) {
                    cacheItemsToDrop.push(cacheItem);
                }
            }
            else {
                stickyRoutesUsed++;
                if (stickyRoutesUsed > this_1.constraint.maxStickyRoutes) {
                    cacheItemsToDrop.push(cacheItem);
                }
            }
        };
        var this_1 = this;
        for (var _i = 0, _a = this.cache; _i < _a.length; _i++) {
            var cacheItem = _a[_i];
            _loop_1(cacheItem);
        }
        for (var _b = 0, cacheItemsToDrop_1 = cacheItemsToDrop; _b < cacheItemsToDrop_1.length; _b++) {
            var cacheToDrop = cacheItemsToDrop_1[_b];
            cacheToDrop.destroy();
            this.cache.splice(this.cache.indexOf(cacheToDrop), 1);
        }
    };
    RouteReuseCache.prototype.getCurrentPageId = function () {
        return this.location.getCurrentPageId();
    };
    return RouteReuseCache;
}());
export { RouteReuseCache };
RouteReuseCache.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RouteReuseCache.ctorParameters = function () { return [
    { type: Router, },
    { type: undefined, decorators: [{ type: Inject, args: [REUSE_CACHE_CONSTRAINT,] },] },
    { type: undefined, decorators: [{ type: Inject, args: [LocationStrategy,] },] },
    { type: RouterScrollWrapper, },
]; };
var ReuseCacheItem = (function () {
    function ReuseCacheItem(ref, routeCtx, pageId) {
        if (pageId) {
            this._pageIds = [pageId];
        }
        this._ref = ref;
        this._routeCtx = routeCtx;
    }
    Object.defineProperty(ReuseCacheItem.prototype, "pageIds", {
        /**
         * Cached within specified pageIds
         */
        get: function () {
            return this._pageIds;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReuseCacheItem.prototype, "routeContext", {
        get: function () {
            return this._routeCtx;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReuseCacheItem.prototype, "ref", {
        /**
         * Cached component reference
         */
        get: function () {
            return this._ref;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ReuseCacheItem.prototype, "reuseStrategy", {
        get: function () {
            return this._ref.instance.reuseRouteStrategy;
        },
        enumerable: true,
        configurable: true
    });
    ReuseCacheItem.prototype.addPageId = function (pageId) {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }
        if (!this._pageIds) {
            this._pageIds = [];
        }
        if (this.hasPageId(pageId)) {
            return;
        }
        this._pageIds.push(pageId);
    };
    ReuseCacheItem.prototype.hasPageId = function (pageId) {
        if (!this._pageIds) {
            return false;
        }
        return this._pageIds.indexOf(pageId) >= 0;
    };
    ReuseCacheItem.prototype.detached = function () {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }
        if (this.ref.instance.onRouteCached) {
            this.ref.instance.onRouteCached();
        }
        this.routeContext.deactivate();
    };
    ReuseCacheItem.prototype.attached = function () {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }
        if (this.ref.instance.onRouteReused) {
            this.ref.instance.onRouteReused();
        }
        this.routeContext.activate();
    };
    ReuseCacheItem.prototype.destroy = function () {
        if (this._ref) {
            this._ref.destroy();
            this._ref = null;
        }
    };
    return ReuseCacheItem;
}());
export { ReuseCacheItem };
