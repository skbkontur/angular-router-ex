import {ComponentFactoryResolver, InjectionToken, Injector, NgModuleFactory, Type} from "@angular/core";

export const ROUTE_CONFIG = new InjectionToken<Routes>("router ex route config");

export type Routes = Route[];

export type RouteMatcher = (url: string, route: Route) => Promise<MatchedRouteResult>;// TODO какой тип промиса?

export type LoadModuleCallback = () => Promise<NgModuleFactory<any>>;
export type LoadModuleCondition = (url: string) => boolean;


export type QueryParams = { [id: string]: QueryParam };
export type QueryParam = string | boolean | Array<string | boolean>;


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
    params?: { [name: string]: string };
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
    fallbackTimeout?: number;

    routePrerender(): Promise<any>;
}


// ------- REUSE --------

export enum ReuseRouteStrategy {
    /**
     * Create only one instance of route component and allways reuse them
     */
    STICKY = 1,
    /**
     * Reuse route component only when use return on the route by history pop event
     */
    CACHEBACK = 2
}

export interface IReusableRouterComponent {
    /**
     * Specify route reuse strategy
     */
    reuseRouteStrategy: ReuseRouteStrategy;

    /**
     * Component was detached from outlet and saved to cache for later reuse
     */
    onRouteCached?();

    /**
     * Component was attached to outlet
     */
    onRouteReused?();
}

export interface RouteOutletActivated {
    onRouteOutletActivated();
}

export interface RouteOutletDeactivated {
    onRouteOutletDeactivated();
}
