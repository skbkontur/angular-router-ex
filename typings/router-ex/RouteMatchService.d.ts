import { Compiler, ComponentFactoryResolver, Injector } from "@angular/core";
import { MatchedRouteResult, Routes } from "./Config";
import { RouterModuleFactory } from "./RouterModuleFactory";
export declare const ERROR_PAGE_PATH = "##";
export declare const NOTFOUND_PAGE_PATH = "**";
export declare class RouteMatchService {
    private resolver;
    private injector;
    private moduleLoader;
    private compiler;
    constructor(resolver: ComponentFactoryResolver, injector: Injector, moduleLoader: RouterModuleFactory, compiler: Compiler);
    findRoute(url: string, routes: Routes): Promise<MatchedRouteResult>;
    private resolveInternal(url, routes, injector, resolver);
    private createMatcher(url, route, injector);
}
