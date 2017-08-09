"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RouterModuleFactory_1 = require("./RouterModuleFactory");
var defaultRouteMatcher_1 = require("./matchers/defaultRouteMatcher");
var asyncRouteMatcher_1 = require("./matchers/asyncRouteMatcher");
exports.ERROR_PAGE_PATH = "##";
exports.NOTFOUND_PAGE_PATH = "**";
var RouteMatchService = (function () {
    function RouteMatchService(resolver, injector, moduleLoader, compiler) {
        this.resolver = resolver;
        this.injector = injector;
        this.moduleLoader = moduleLoader;
        this.compiler = compiler;
    }
    RouteMatchService.prototype.findRoute = function (url, routes) {
        return this.resolveInternal(url, routes, this.injector, this.resolver);
    };
    RouteMatchService.prototype.resolveInternal = function (url, routes, injector, resolver) {
        var _this = this;
        return new Promise(function (resolve) {
            if (url[0] !== "/") {
                url = "/" + url;
            }
            var index = 0;
            var processNext = function () {
                var matcher = _this.createMatcher(url, routes[index], injector);
                matcher(url, routes[index])
                    .then(function (result) {
                    if (!result) {
                        index++;
                        if (index >= routes.length) {
                            var defaultRoute = routes.find(function (r) { return r.path === exports.NOTFOUND_PAGE_PATH; });
                            if (defaultRoute) {
                                var notFoundResult = {
                                    route: defaultRoute,
                                    component: defaultRoute.component,
                                    injector: _this.injector,
                                    factoryResolver: _this.resolver,
                                    params: {}
                                };
                                resolve(notFoundResult); // no route found
                            }
                            else {
                                resolve(null);
                            }
                        }
                        else {
                            processNext();
                        }
                    }
                    else {
                        // from async modules matcher can return already resolved routes,
                        // if it is so, use original route from nested resolved route,
                        // not the original form top-level.
                        var route = result.route || routes[index];
                        resolve({
                            params: result.params,
                            component: result.component,
                            factoryResolver: result.factoryResolver || resolver,
                            injector: result.injector || injector,
                            route: route
                        });
                    }
                }, function (err) {
                    var errorRoute = routes.find(function (r) { return r.path === exports.ERROR_PAGE_PATH; });
                    if (errorRoute) {
                        var errorResult = {
                            route: errorRoute,
                            component: errorRoute.component,
                            injector: _this.injector,
                            factoryResolver: _this.resolver,
                            params: {},
                            noCache: true
                        };
                        resolve(errorResult); // no route found
                    }
                    else {
                        resolve(null);
                    }
                    console.error(err);
                });
            };
            processNext();
        });
    };
    RouteMatchService.prototype.createMatcher = function (url, route, injector) {
        var _this = this;
        if (route.matcher) {
            return route.matcher;
        }
        return route.loadModule ? asyncRouteMatcher_1.createAsyncMatcher(this.moduleLoader, injector, this.compiler, function (loadedRoutes, injector, resolver) { return _this.resolveInternal(url, loadedRoutes, injector, resolver); }) : defaultRouteMatcher_1.defaultRouteMatcher;
    };
    return RouteMatchService;
}());
RouteMatchService.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
RouteMatchService.ctorParameters = function () { return [
    { type: core_1.ComponentFactoryResolver, },
    { type: core_1.Injector, },
    { type: RouterModuleFactory_1.RouterModuleFactory, },
    { type: core_1.Compiler, },
]; };
exports.RouteMatchService = RouteMatchService;
