import { ComponentFactoryResolver, Type, Injector, ComponentRef } from "@angular/core";
import { RouteContext } from "./RouteContext";
import { ResolvedRoute } from "./Config";
export interface IRouterOutlet {
    activate(route: ResolvedRoute, url: string, component: Type<any>, resolver: ComponentFactoryResolver, injector: Injector, force?: boolean): Promise<IOutletActivationResult>;
    activatedComponent: ComponentRef<any>;
}
export interface IOutletActivationResult {
    routeContext: RouteContext;
}
export declare class RouterOutletMap {
    private map;
    register(outlet: IRouterOutlet, name?: string): void;
    unregister(name: string): void;
    getOutlet(name?: string): IRouterOutlet;
}
