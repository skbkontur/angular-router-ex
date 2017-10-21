import { NgModule, APP_BOOTSTRAP_LISTENER, ApplicationRef, ANALYZE_FOR_ENTRY_COMPONENTS, SystemJsNgModuleLoader, NgModuleFactoryLoader } from "@angular/core";
import { ROUTE_CONFIG } from "./Config";
import { RouterOutletMap } from "./RouterOutletMap";
import { RouteMatchService } from "./RouteMatchService";
import { RouterExOutletComponent } from "./directives/router-ex-outlet.component";
import { CommonModule, Location, LocationStrategy } from "@angular/common";
import { Router } from "./Router";
import { HandleHrefNavigationDirective } from "./directives/handleHrefNavigation.directive";
import { RouterModuleFactory, DefaultRouterModuleFactory } from "./RouterModuleFactory";
import { HistoryApiLocationStrategy } from "./HistoryApiLocationStrategy";
import { RouteReuseCache, REUSE_CACHE_CONSTRAINT } from "./RouteReuseCache";
import { RouterScrollWrapper } from "./RouterScrollWrapper";
import { QueryStringParser } from "./QueryStringParser";
var DEFAULT_CACHE_CONSTRAINT = { maxStickyRoutes: 2, maxHistoryCacheDepth: 1 };
var RouterExModule = /** @class */ (function () {
    function RouterExModule() {
    }
    RouterExModule.forRoot = function (routeConfig) {
        return {
            ngModule: RouterExModule,
            providers: [
                Location,
                RouterOutletMap,
                RouteMatchService,
                Router,
                RouteReuseCache,
                RouterScrollWrapper,
                { provide: RouterModuleFactory, useClass: DefaultRouterModuleFactory },
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig },
                { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
                { provide: LocationStrategy, useClass: HistoryApiLocationStrategy },
                { provide: ROUTE_CONFIG, useValue: routeConfig },
                {
                    provide: REUSE_CACHE_CONSTRAINT,
                    useValue: DEFAULT_CACHE_CONSTRAINT
                },
                {
                    provide: APP_BOOTSTRAP_LISTENER, multi: true, useFactory: initialRouterNavigation,
                    deps: [Router, ApplicationRef]
                }
            ]
        };
    };
    RouterExModule.forChild = function (routeConfig) {
        return {
            ngModule: RouterExModule,
            providers: [
                { provide: ROUTE_CONFIG, useValue: routeConfig },
                { provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig },
            ]
        };
    };
    RouterExModule.decorators = [
        { type: NgModule, args: [{
                    exports: [
                        RouterExOutletComponent,
                        HandleHrefNavigationDirective
                    ],
                    declarations: [
                        RouterExOutletComponent,
                        HandleHrefNavigationDirective
                    ],
                    providers: [
                        QueryStringParser
                    ],
                    imports: [
                        CommonModule
                    ]
                },] },
    ];
    /** @nocollapse */
    RouterExModule.ctorParameters = function () { return []; };
    return RouterExModule;
}());
export { RouterExModule };
export function initialRouterNavigation(router, ref) {
    return function (bootstrappedComponentRef) {
        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }
        router.initialNavigation();
    };
}
