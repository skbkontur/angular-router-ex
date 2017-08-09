import { Type, ComponentFactoryResolver, Injector, NgModuleFactory, InjectionToken } from "@angular/core";
export declare const ROUTE_CONFIG: InjectionToken<Route[]>;
export declare type Routes = Route[];
export declare type RouteMatcher = (url: string, route: Route) => Promise<MatchedRouteResult>;
export declare type LoadModuleCallback = () => Promise<NgModuleFactory<any>>;
export declare type LoadModuleCondition = (url: string) => boolean;
export declare type QueryParams = {
    [id: string]: QueryParam;
};
export declare type QueryParam = string | boolean | Array<string | boolean>;
export interface Route {
    path?: string;
    component?: Type<any>;
    load?: string;
    matcher?: RouteMatcher;
    canActivate?: any[];
    canDeactivate?: any[];
    outlet?: string;
    loadModule?: LoadModuleCallback | string;
    loadModuleCondition?: LoadModuleCondition;
}
export interface MatchedRouteResult {
    component: Type<any>;
    params?: {
        [name: string]: string;
    };
    factoryResolver?: ComponentFactoryResolver;
    injector?: Injector;
    route: Route;
    noCache?: boolean;
}
export interface ResolvedRoute extends MatchedRouteResult {
    factoryResolver: ComponentFactoryResolver;
    injector: Injector;
    queryParams: QueryParams;
    url: string;
}
export interface NavigationExtras {
    replaceUrl?: boolean;
    force?: boolean;
}
/**
 * Make router component prerenderable
 */
export interface IPrerenderRouterComponent {
    routePrerender(): Promise<any>;
}
export declare enum ReuseRouteStrategy {
    /**
     * Create only one instance of route component and allways reuse them
     */
    STICKY = 1,
    /**
     * Reuse route componentn only when use return on the route by history pop event
     */
    CACHEBACK = 2,
}
export interface IReusableRouterComponent {
    /**
     * Specify route reuse strategy
     */
    reuseRouteStrategy: ReuseRouteStrategy;
    /**
     * Component was detached from outlet and saved to cache for later reuse
     */
    onRouteCached?(): any;
    /**
     * Component was attached to outlet
     */
    onRouteReused?(): any;
}
export interface RouteOutletActivated {
    onRouteOutletActivated(): any;
}
export interface RouteOutletDeactivated {
    onRouteOutletDeactivated(): any;
}
