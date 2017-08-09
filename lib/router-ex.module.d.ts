import { ModuleWithProviders, ApplicationRef, ComponentRef } from "@angular/core";
import { Routes } from "./Config";
import { Router } from "./Router";
export declare class RouterExModule {
    static forRoot(routeConfig: Routes): ModuleWithProviders;
    static forChild(routeConfig: Routes): ModuleWithProviders;
}
export declare function initialRouterNavigation(router: Router, ref: ApplicationRef): (bootstrappedComponentRef: ComponentRef<any>) => void;
