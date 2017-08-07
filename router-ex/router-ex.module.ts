import {
    NgModule,
    ModuleWithProviders,
    APP_BOOTSTRAP_LISTENER,
    ApplicationRef,
    ComponentRef,
    ANALYZE_FOR_ENTRY_COMPONENTS,
    SystemJsNgModuleLoader,
    NgModuleFactoryLoader
} from "@angular/core";
import {Routes, ROUTE_CONFIG} from "./Config";
import {RouterOutletMap} from "./RouterOutletMap";
import {RouteMatchService} from "./RouteMatchService";
import {RouterExOutletComponent} from "./directives/router-ex-outlet.component";
import {CommonModule, Location, LocationStrategy} from "@angular/common";
import {Router} from "./Router";
import {HandleHrefNavigationDirective} from "./directives/handleHrefNavigation.directive";
import {RouterModuleFactory, DefaultRouterModuleFactory} from "./RouterModuleFactory";
import {HistoryApiLocationStrategy} from "./HistoryApiLocationStrategy";
import {RouteReuseCache, REUSE_CACHE_CONSTRAINT, ReuseCacheConstraint} from "./RouteReuseCache";
import {RouterScrollWrapper} from "./RouterScrollWrapper";
import {QueryStringParser} from "./QueryStringParser";

const DEFAULT_CACHE_CONSTRAINT: ReuseCacheConstraint = {maxStickyRoutes: 2, maxHistoryCacheDepth: 1};

@NgModule({
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
})
export class RouterExModule {

    static forRoot(routeConfig: Routes): ModuleWithProviders {
        return {
            ngModule: RouterExModule,
            providers: [
                Location,
                RouterOutletMap,
                RouteMatchService,
                Router,
                RouteReuseCache,
                RouterScrollWrapper,
                {provide: RouterModuleFactory, useClass: DefaultRouterModuleFactory},
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig},
                {provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader},
                {provide: LocationStrategy, useClass: HistoryApiLocationStrategy},
                {provide: ROUTE_CONFIG, useValue: routeConfig},
                {
                    provide: REUSE_CACHE_CONSTRAINT,
                    useValue: DEFAULT_CACHE_CONSTRAINT
                },
                {
                    provide: APP_BOOTSTRAP_LISTENER, multi: true, useFactory: initialRouterNavigation,
                    deps: [Router, ApplicationRef]
                }
            ]
        }

    }

    static forChild(routeConfig: Routes): ModuleWithProviders {
        return {
            ngModule: RouterExModule,
            providers: [
                {provide: ROUTE_CONFIG, useValue: routeConfig},
                {provide: ANALYZE_FOR_ENTRY_COMPONENTS, multi: true, useValue: routeConfig},
            ]
        }
    }

}

export function initialRouterNavigation(router: Router, ref: ApplicationRef) {
    return (bootstrappedComponentRef: ComponentRef<any>) => {

        if (bootstrappedComponentRef !== ref.components[0]) {
            return;
        }

        router.initialNavigation();
    };
}

