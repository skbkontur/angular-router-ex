import {Route} from "./Config";
export interface CanDeactivate<T> {
    canDeactivate(component: T, currentRoute: Route): Promise<boolean>;
}

export interface CanActivate {
    canActivate(route: Route): Promise<boolean>;
}
