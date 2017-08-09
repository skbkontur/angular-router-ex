"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var RouteMatchService_1 = require("./RouteMatchService");
var Subject_1 = require("rxjs/Subject");
var RouterOutletMap_1 = require("./RouterOutletMap");
var Config_1 = require("./Config");
var RouteEvents_1 = require("./RouteEvents");
var QueryStringParser_1 = require("./QueryStringParser");
var BehaviorSubject_1 = require("rxjs/BehaviorSubject");
var concatMap_1 = require("rxjs/operator/concatMap");
var of_1 = require("rxjs/observable/of");
var IsParamsEqual_1 = require("./IsParamsEqual");
var UrlParser_1 = require("./UrlParser");
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
        this.navigations = new BehaviorSubject_1.BehaviorSubject(null);
        this._events = new Subject_1.Subject();
        if (!this.baseHref) {
            this.baseHref = "/";
        }
        this.processNavigations();
    }
    Object.defineProperty(Router.prototype, "queryParams", {
        get: function () {
            return this._queryParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Router.prototype, "queryParamsSnapshot", {
        get: function () {
            return this._queryParams.getValue();
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
    Router.prototype.initialNavigation = function () {
        this.setUpLocationChangeListener();
        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), { replaceUrl: true });
        }
    };
    Router.prototype.reload = function () {
        if (!this.currentContext) {
            return Promise.resolve(false);
        }
        return this.navigateInternal(this.currentContext.url, { replaceUrl: true, force: true });
    };
    Router.prototype.navigateByUrl = function (url, extras) {
        // absolute url
        if (url.indexOf("https://") === 0 || url.indexOf("http://") === 0 || url.indexOf("//") === 0) {
            var requestedUrl = UrlParser_1.UrlParser.parseUrl(url);
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
        if (this.currentContext && url === this.currentContext.url) {
            // navigation within same url
            return Promise.resolve(true);
        }
        // schedule
        return this.navigateInternal(url, extras);
    };
    Router.prototype.setQuery = function (p, navigationExtras) {
        if (this.navigating) {
            return Promise.resolve(null);
        }
        var queryParams = this.queryStringParser.serialize(p);
        var urlParts = this.location.path(true).split("?");
        var newUrl = queryParams.length ? urlParts[0] + "?" + queryParams : urlParts[0];
        return this.navigateByUrl(newUrl, navigationExtras);
    };
    Router.prototype.updateQuery = function (p, navigationExtras) {
        var existingParams = tslib_1.__assign({}, this.queryParamsSnapshot, p);
        return this.setQuery(existingParams, navigationExtras);
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
    Router.prototype.executeScheduledNavigation = function (_a) {
        var _this = this;
        var extras = _a.extras, id = _a.id, url = _a.url;
        var force = extras && extras.force;
        if (this.currentContext && (!force && Router.urlEquals(url, this.currentContext.url))) {
            // drop same navigation
            return Promise.resolve(true);
        }
        var shouldReplaceUrl = extras ? extras.replaceUrl : false;
        var config = this.injector.get(Config_1.ROUTE_CONFIG);
        this.navigating = true;
        this._events.next(new RouteEvents_1.NavigationStart());
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
                shouldActivate = false;
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
                outlet = _this.outletMap.getOutlet();
                var resolvedRoute = checkGuardsResult.resolvedRoute;
                if (shouldActivate) {
                    // new route navigation
                    return outlet.activate(resolvedRoute, url, resolvedRoute.component, resolvedRoute.factoryResolver, resolvedRoute.injector).then(function (result) { return result.routeContext; });
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
                _this._events.next(new RouteEvents_1.NavigationCancel());
                return;
            }
            // make sure queryParams changed before pushing to observable
            if (!IsParamsEqual_1.isParamsEqual(_this.queryParamsSnapshot, _this.currentContext.queryParamsSnapshot)) {
                _this._queryParams.next(_this.currentContext.queryParamsSnapshot);
            }
            _this._events.next(new RouteEvents_1.NavigationEnd(url, outlet.activatedComponent, _this.currentContext));
        })
            .catch(function (e) {
            _this.navigating = false;
            throw e;
        });
    };
    Router.prototype.matchRoute = function (url, config) {
        var _this = this;
        var path = url.split("?")[0];
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
    Router.prototype.resolveRoute = function (originalUrl, route) {
        var urlParts = originalUrl.split("?");
        var queryParams = {};
        if (urlParts.length >= 2) {
            // set url params to match its parsed state
            queryParams = this.queryStringParser.parse(urlParts.slice(1).join("?") || "");
            var qs = this.queryStringParser.serialize(queryParams);
            originalUrl = urlParts[0] + (qs.length ? "?" + qs : "");
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
    Router.prototype.processNavigations = function () {
        var _this = this;
        concatMap_1.concatMap
            .call(this.navigations, function (nav) {
            if (nav) {
                return _this.executeScheduledNavigation(nav).then(nav.resolve, nav.reject);
            }
            else {
                return of_1.of(null);
            }
        })
            .subscribe(function () {
        });
        // initial query string
        var queryString = this.location.path(true).split("?")[1];
        this._queryParams = new BehaviorSubject_1.BehaviorSubject(this.queryStringParser.parse(queryString));
    };
    Router.prototype.scheduleNavigation = function (nav) {
        this.navigations.next(nav);
    };
    Router.prototype.resetUrlToCurrent = function () {
        if (this.currentContext) {
            this.location.replaceState(this.currentContext.url);
        }
        else {
            // TODO ситуация когда пользователь сразу переходит на защищенный маршрут
        }
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
    Router.urlEquals = function (url1, url2) {
        url1 = Router.stripTrailingSlash(url1);
        url2 = Router.stripTrailingSlash(url2);
        return decodeURIComponent(url1) === decodeURIComponent(url2);
    };
    Router.stripTrailingSlash = function (url) {
        return url[url.length - 1] === "/" ? url.slice(0, -1) : url;
    };
    return Router;
}());
Router.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
Router.ctorParameters = function () { return [
    { type: RouterOutletMap_1.RouterOutletMap, },
    { type: RouteMatchService_1.RouteMatchService, },
    { type: common_1.Location, },
    { type: core_1.Injector, },
    { type: QueryStringParser_1.QueryStringParser, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [common_1.APP_BASE_HREF,] },] },
]; };
exports.Router = Router;
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
