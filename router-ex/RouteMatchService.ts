import {Compiler, ComponentFactoryResolver, Injectable, Injector} from "@angular/core";
import {MatchedRouteResult, Route, RouteMatcher, Routes} from "./Config";
import {RouterModuleFactory} from "./RouterModuleFactory";
import {defaultRouteMatcher} from "./matchers/defaultRouteMatcher";
import {createAsyncMatcher} from "./matchers/asyncRouteMatcher";

export const ERROR_PAGE_PATH = "##";
export const NOTFOUND_PAGE_PATH = "**";

@Injectable()
export class RouteMatchService {

    constructor(private resolver: ComponentFactoryResolver,
                private injector: Injector,
                private moduleLoader: RouterModuleFactory,
                private compiler: Compiler) {

    }

    findRoute(url: string, routes: Routes): Promise<MatchedRouteResult> {
        return this.resolveInternal(url, routes, this.injector, this.resolver);
    }

    private resolveInternal(url: string, routes: Routes, injector: Injector, resolver: ComponentFactoryResolver): Promise<MatchedRouteResult> {
        return new Promise((resolve) => {

            if (url[0] !== "/") {
                url = "/" + url;
            }

            let index = 0;

            let processNext = () => {
                const matcher = this.createMatcher(url, routes[index], injector);

                matcher(url, routes[index])
                    .then((result: MatchedRouteResult) => {

                        if (!result) {
                            index++;
                            if (index >= routes.length) {
                                const defaultRoute = routes.find(r => r.path === NOTFOUND_PAGE_PATH);
                                if (defaultRoute) {
                                    const notFoundResult: MatchedRouteResult = {
                                        route: defaultRoute,
                                        component: defaultRoute.component,
                                        injector: this.injector,
                                        factoryResolver: this.resolver,
                                        params: {}
                                    };
                                    resolve(notFoundResult); // no route found
                                } else {
                                    resolve(null);
                                }
                            } else {
                                processNext();
                            }
                        } else {
                            // from async modules matcher can return already resolved routes,
                            // if it is so, use original route from nested resolved route,
                            // not the original form top-level.

                            const route = result.route || routes[index];
                            resolve({
                                params: result.params,
                                component: result.component,
                                factoryResolver: result.factoryResolver || resolver,
                                injector: result.injector || injector,
                                route: route
                            });

                        }
                    }, err => {
                        const errorRoute = routes.find(r => r.path === ERROR_PAGE_PATH);
                        if (errorRoute) {
                            const errorResult: MatchedRouteResult = {
                                route: errorRoute,
                                component: errorRoute.component,
                                injector: this.injector,
                                factoryResolver: this.resolver,
                                params: {},
                                noCache: true
                            };
                            resolve(errorResult); // no route found
                        } else {
                            resolve(null);
                        }
                        console.error(err);
                    });

            };

            processNext();
        });
    }

    private createMatcher(url: string, route: Route, injector: Injector): RouteMatcher {
        if (route.matcher) {
            return route.matcher;
        }
        return route.loadModule ? createAsyncMatcher(this.moduleLoader, injector, this.compiler, (loadedRoutes, injector, resolver) => this.resolveInternal(url, loadedRoutes, injector, resolver)) : defaultRouteMatcher;
    }

}
