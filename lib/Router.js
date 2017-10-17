import * as tslib_1 from "tslib";
import { Inject, Injectable, Injector, Optional } from "@angular/core";
import { APP_BASE_HREF, Location } from "@angular/common";
import { RouteMatchService } from "./RouteMatchService";
import { Subject } from "rxjs/Subject";
import { RouterOutletMap } from "./RouterOutletMap";
import { ROUTE_CONFIG } from "./Config";
import { NavigationCancel, NavigationEnd, NavigationStart } from "./RouteEvents";
import { QueryStringParser } from "./QueryStringParser";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { concatMap } from "rxjs/operator/concatMap";
import { of } from "rxjs/observable/of";
import { isParamsEqual } from "./IsParamsEqual";
import { UrlParser } from "./UrlParser";
var Router = (function () {
    function Router(outletMap, matchService, location, injector, queryStringParser, baseHref) {
        this.outletMap = outletMap;
        this.matchService = matchService;
        this.location = location;
        this.injector = injector;
        this.queryStringParser = queryStringParser;
        this.baseHref = baseHref;
        this.resolvedRoutes = {};
        this.navigationId = 0;
        this.navigations = new BehaviorSubject(null);
        this._events = new Subject();
        if (!this.baseHref) {
            this.baseHref = "/";
        }
        this.processNavigations();
    }
    Object.defineProperty(Router.prototype, "queryParamsSnapshot", {
        get: function () {
            return this._queryParams.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "queryParams", {
        get: function () {
            return this._queryParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "events", {
        get: function () {
            return this._events;
        },
        enumerable: true,
        configurable: true
    });
    Router.stripTrailingSlash = function (url) {
        return url[url.length - 1] === "/" ? url.slice(0, -1) : url;
    };
    Router.urlEquals = function (url1, url2) {
        url1 = Router.stripTrailingSlash(url1);
        url2 = Router.stripTrailingSlash(url2);
        return decodeURIComponent(url1) === decodeURIComponent(url2);
    };
    Router.prototype.initialNavigation = function () {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), { replaceUrl: true });
        }
    };
    Router.prototype.navigateByUrl = function (url, extras) {
        // absolute url
        if (url.indexOf("https://") === 0 || url.indexOf("http://") === 0 || url.indexOf("//") === 0) {
            var requestedUrl = UrlParser.parseUrl(url);
            if (window.location
                && window.location.host == requestedUrl.host
                && window.location.protocol == requestedUrl.protocol) {
                // это наш хост, выбросим часть маршрута
                url = requestedUrl.pathname + requestedUrl.search + requestedUrl.hash;
            }
            else {
                throw new Error('Router: cannot navigate to external url');
            }
        }
        else if (url[0] !== "/") {
            // add base href
            url = this.baseHref + url;
        }
        if ((extras && !extras.force) && this.currentContext && url === this.currentContext.url) {
            // navigation within same url
            return Promise.resolve(true);
        }
        // schedule
        return this.navigateInternal(url, extras);
    };
    Router.prototype.reload = function () {
        if (!this.currentContext) {
            return Promise.resolve(false);
        }
        return this.navigateByUrl(this.currentContext.url, { replaceUrl: true, force: true });
    };
    Router.prototype.setQuery = function (p, navigationExtras) {
        if (this.navigating) {
            return Promise.resolve(null);
        }
        var queryParams = this.queryStringParser.serialize(p);
        var urlParts = UrlParser.parseUrl(this.location.path(true));
        var newUrl = queryParams.length ? urlParts.pathname + "?" + queryParams : urlParts.pathname;
        return this.navigateByUrl(newUrl, navigationExtras);
    };
    Router.prototype.setUpLocationChangeListener = function () {
        var _this = this;
        // Zone.current.wrap is needed because of the issue with RxJS scheduler,
        // which does not work properly with zone.js in IE and Safari
        if (!this.locationSubscription) {
            this.locationSubscription = this.location.subscribe(Zone.current.wrap(function (change) {
                _this.navigateByUrl(change["url"], { replaceUrl: true });
            }));
        }
    };
    Router.prototype.updateQuery = function (p, navigationExtras) {
        var existingParams = tslib_1.__assign({}, this.queryParamsSnapshot, p);
        return this.setQuery(existingParams, navigationExtras);
    };
    Router.prototype.checkDeactivate = function (currentRoute, injector) {
        if (!currentRoute.canDeactivate) {
            return Promise.resolve(true);
        }
        var outlet = this.outletMap.getOutlet(currentRoute.outlet);
        var results = [];
        for (var _i = 0, _a = currentRoute.canDeactivate; _i < _a.length; _i++) {
            var guardType = _a[_i];
            var guard = injector.get(guardType);
            results.push(guard.canDeactivate(outlet.activatedComponent, currentRoute));
        }
        return Promise.all(results).then(function (all) {
            return !all.some(function (r) { return !r; });
        });
    };
    Router.prototype.checkGuards = function (newRoute) {
        var deactivation = this.currentContext ? this.checkDeactivate(this.currentContext.route, this.currentContext.injector) : Promise.resolve(true);
        // check deactivation first
        return deactivation.then(function (success) {
            if (!success) {
                return { resolvedRoute: newRoute, success: false };
            }
            // check activation
            return checkActivate(newRoute.route, newRoute.injector).then(function (success) {
                return { resolvedRoute: newRoute, success: success };
            });
        });
    };
    Router.prototype.executeScheduledNavigation = function (_a) {
        var _this = this;
        var extras = _a.extras, id = _a.id, url = _a.url;
        var force = extras && extras.force;
        if (this.currentContext && (!force && Router.urlEquals(url, this.currentContext.url))) {
            // drop same navigation
            return Promise.resolve(true);
        }
        var shouldReplaceUrl = extras ? extras.replaceUrl : false;
        var config = this.injector.get(ROUTE_CONFIG);
        this.navigating = true;
        this._events.next(new NavigationStart());
        var navigationCanceled, shouldActivate = true, outlet;
        return this.matchRoute(url, config)
            .then(function (route) { return _this.resolveRoute(url, route); })
            .then(function (resolvedRoute) {
            if (_this.navigationId !== id) {
                // navigation changes while resolving
                navigationCanceled = true;
                return undefined;
            }
            if (_this.currentContext && _this.currentContext.route.path === resolvedRoute.route.path) {
                // navigating with same route
                shouldActivate = force;
                _this.currentContext.update(url, resolvedRoute);
                return { resolvedRoute: resolvedRoute, success: true };
            }
            // set url params to match its parsed state
            if (resolvedRoute.url !== url) {
                url = resolvedRoute.url;
            }
            // check guards if routes changes
            return _this.checkGuards(resolvedRoute);
        })
            .then(function (checkGuardsResult) {
            if (_this.navigationId !== id) {
                // navigation changes while resolving or guard checking
                navigationCanceled = true;
                return _this.currentContext;
            }
            if (checkGuardsResult.success) {
                // we should change location state before activate outlet
                if (shouldReplaceUrl) {
                    _this.location.replaceState(url);
                }
                else {
                    _this.location.go(url);
                }
                outlet = _this.outletMap.getOutlet(checkGuardsResult.resolvedRoute.route.outlet);
                var resolvedRoute = checkGuardsResult.resolvedRoute;
                if (shouldActivate) {
                    // new route navigation
                    return outlet.activate(resolvedRoute, url, resolvedRoute.component, resolvedRoute.factoryResolver, resolvedRoute.injector, force).then(function (result) { return result.routeContext; });
                }
            }
            else {
                // guard blocked navigation
                _this.resetUrlToCurrent();
                navigationCanceled = true;
            }
            return _this.currentContext;
        })
            .then(function (routeContext) {
            _this.currentContext = routeContext;
        })
            .then(function () {
            _this.navigating = false;
            if (navigationCanceled) {
                _this._events.next(new NavigationCancel());
                return;
            }
            // make sure queryParams changed before pushing to observable
            if (!isParamsEqual(_this.queryParamsSnapshot, _this.currentContext.queryParamsSnapshot)) {
                _this._queryParams.next(_this.currentContext.queryParamsSnapshot);
            }
            _this._events.next(new NavigationEnd(url, outlet.activatedComponent, _this.currentContext));
        })
            .catch(function (e) {
            _this.navigating = false;
            throw e;
        });
    };
    Router.prototype.matchRoute = function (url, config) {
        var _this = this;
        var path = UrlParser.parseUrl(url).pathname;
        if (!this.resolvedRoutes[path]) {
            return this.matchService.findRoute(url, config).then(function (route) {
                if (!route.noCache) {
                    _this.resolvedRoutes[path] = route;
                }
                return route;
            });
        }
        else {
            return Promise.resolve(this.resolvedRoutes[path]);
        }
    };
    Router.prototype.navigateInternal = function (url, extras) {
        var resolve = null, reject = null;
        var result = new Promise(function (r, rej) {
            resolve = r;
            reject = rej;
        });
        this.scheduleNavigation({
            extras: extras,
            id: ++this.navigationId,
            promise: result,
            resolve: resolve,
            reject: reject,
            url: url
        });
        return result;
    };
    Router.prototype.processNavigations = function () {
        var _this = this;
        concatMap
            .call(this.navigations, function (nav) {
            if (nav) {
                return _this.executeScheduledNavigation(nav).then(nav.resolve, nav.reject);
            }
            else {
                return of(null);
            }
        })
            .subscribe(function () {
        });
        // initial query string
        var queryString = UrlParser.parseUrl(this.location.path(true)).search;
        this._queryParams = new BehaviorSubject(this.queryStringParser.parse(queryString));
    };
    Router.prototype.resetUrlToCurrent = function () {
        if (this.currentContext) {
            this.location.replaceState(this.currentContext.url);
        }
        else {
            // TODO ситуация когда пользователь сразу переходит на защищенный маршрут
        }
    };
    Router.prototype.resolveRoute = function (originalUrl, route) {
        var urlParts = UrlParser.parseUrl(originalUrl);
        var queryParams = {};
        if (urlParts.search.length > 0) {
            // set url params to match its parsed state
            queryParams = this.queryStringParser.parse(urlParts.search);
            var qs = this.queryStringParser.serialize(queryParams);
            originalUrl = urlParts.pathname + (qs.length ? "?" + qs : "");
        }
        return {
            component: route.component,
            params: route.params,
            factoryResolver: route.factoryResolver,
            injector: route.injector || this.injector,
            route: route.route,
            queryParams: queryParams,
            url: originalUrl
        };
    };
    Router.prototype.scheduleNavigation = function (nav) {
        this.navigations.next(nav);
    };
    return Router;
}());
export { Router };
Router.decorators = [
    { type: Injectable },
];
/** @nocollapse */
Router.ctorParameters = function () { return [
    { type: RouterOutletMap, },
    { type: RouteMatchService, },
    { type: Location, },
    { type: Injector, },
    { type: QueryStringParser, },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [APP_BASE_HREF,] },] },
]; };
function checkActivate(newRoute, injector) {
    if (!newRoute.canActivate) {
        return Promise.resolve(true);
    }
    var results = [];
    for (var _i = 0, _a = newRoute.canActivate; _i < _a.length; _i++) {
        var guardType = _a[_i];
        var guard = injector.get(guardType);
        results.push(guard.canActivate(newRoute));
    }
    return Promise.all(results).then(function (all) {
        return !all.some(function (r) { return !r; });
    });
}
