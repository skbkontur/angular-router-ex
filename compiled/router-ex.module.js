"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var Config_1 = require("./Config");
var RouterOutletMap_1 = require("./RouterOutletMap");
var RouteMatchService_1 = require("./RouteMatchService");
var router_ex_outlet_component_1 = require("./directives/router-ex-outlet.component");
var common_1 = require("@angular/common");
var Router_1 = require("./Router");
var handleHrefNavigation_directive_1 = require("./directives/handleHrefNavigation.directive");
var RouterModuleFactory_1 = require("./RouterModuleFactory");
var HistoryApiLocationStrategy_1 = require("./HistoryApiLocationStrategy");
var RouteReuseCache_1 = require("./RouteReuseCache");
var RouterScrollWrapper_1 = require("./RouterScrollWrapper");
var QueryStringParser_1 = require("./QueryStringParser");
var DEFAULT_CACHE_CONSTRAINT = { maxStickyRoutes: 2, maxHistoryCacheDepth: 1 };
var RouterExModule = (function () {
    function RouterExModule() {
    }
    RouterExModule.forRoot = function (routeConfig) {
        return {
            ngModule: RouterExModule,
            providers: [
                common_1.Location,
                RouterOutletMap_1.RouterOutletMap,
                RouteMatchService_1.RouteMatchService,
                Router_1.Router,
                RouteReuseCache_1.RouteReuseCache,
                RouterScrollWrapper_1.RouterScrollWrapper,
                { provide: RouterModuleFactory_1.RouterModuleFactory, useClass: RouterModuleFactory_1.DefaultRouterModuleFactory },
                { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig },
                { provide: core_1.NgModuleFactoryLoader, useClass: core_1.SystemJsNgModuleLoader },
                { provide: common_1.LocationStrategy, useClass: HistoryApiLocationStrategy_1.HistoryApiLocationStrategy },
                { provide: Config_1.ROUTE_CONFIG, useValue: routeConfig },
                {
                    provide: RouteReuseCache_1.REUSE_CACHE_CONSTRAINT,
                    useValue: DEFAULT_CACHE_CONSTRAINT
                },
                {
                    provide: core_1.APP_BOOTSTRAP_LISTENER, multi: true, useFactory: initialRouterNavigation,
                    deps: [Router_1.Router, core_1.ApplicationRef]
                }
            ]
        };
    };
    RouterExModule.forChild = function (routeConfig) {
        return {
            ngModule: RouterExModule,
            providers: [
                { provide: Config_1.ROUTE_CONFIG, useValue: routeConfig },
                { provide: core_1.ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig },
            ]
        };
    };
    return RouterExModule;
}());
RouterExModule.decorators = [
    { type: core_1.NgModule, args: [{
                exports: [
                    router_ex_outlet_component_1.RouterExOutletComponent,
                    handleHrefNavigation_directive_1.HandleHrefNavigationDirective
                ],
                declarations: [
                    router_ex_outlet_component_1.RouterExOutletComponent,
                    handleHrefNavigation_directive_1.HandleHrefNavigationDirective
                ],
                providers: [
                    QueryStringParser_1.QueryStringParser
                ],
                imports: [
                    common_1.CommonModule
                ]
            },] },
];
/** @nocollapse */
RouterExModule.ctorParameters = function () { return []; };
exports.RouterExModule = RouterExModule;
function initialRouterNavigation(router, ref) {
    return function (bootstrappedComponentRef) {
        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }
        router.initialNavigation();
    };
}
exports.initialRouterNavigation = initialRouterNavigation;
