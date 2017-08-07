import {Injectable, ComponentFactoryResolver, Type, Injector, ComponentRef} from "@angular/core";
import {RouteContext} from "./RouteContext";
import {ResolvedRoute} from "./Config";

const PRIMARY_OUTLET = "__router-ex-default";

export interface IRouterOutlet {

    activate(route: ResolvedRoute,
             url: string,
             component: Type<any>,
             resolver: ComponentFactoryResolver,
             injector: Injector): Promise<IOutletActivationResult>;

    activatedComponent: ComponentRef<any>

}

export interface IOutletActivationResult {
    routeContext: RouteContext
}

@Injectable()
export class RouterOutletMap {

    private map = {};

    register(outlet: IRouterOutlet, name?: string) {
        this.map[name || PRIMARY_OUTLET] = outlet;
    }

    unregister(name: string) {
        delete this.map[name];
    }

    getOutlet(name?: string): IRouterOutlet {
        return this.map[name || PRIMARY_OUTLET];
    }

}
