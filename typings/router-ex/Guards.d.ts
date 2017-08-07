import {Route} from "./Config";
export declare interface CanDeactivate<T> {
    canDeactivate(component: T, currentRoute: Route): Promise<boolean>;
}

export declare interface CanActivate {
    canActivate(route: Route): Promise<boolean>;
}
