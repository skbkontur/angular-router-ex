import { ComponentRef } from "@angular/core";
import { RouteContext } from "./RouteContext";
export interface NavigationEvent {
}
export declare class NavigationStart implements NavigationEvent {
    constructor();
}
export declare class NavigationEnd implements NavigationEvent {
    private _url;
    private _component;
    private _routeCtx;
    constructor(url: string, component: ComponentRef<any>, routeCtx: RouteContext);
    readonly url: string;
    readonly activatedComponent: ComponentRef<any>;
    readonly routeContext: RouteContext;
}
export declare class NavigationCancel implements NavigationEvent {
}
