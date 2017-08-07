import { CanActivate, CanDeactivate, Route } from "../../../router-ex/";
import { GuardComponent } from "./guard.component";
export declare function enableGuards(): void;
export declare function disabledGuards(): void;
export declare class GuardOnActivate implements CanActivate {
    canActivate(route: Route): Promise<boolean>;
}
export declare class GuardOnDeactivate implements CanDeactivate<GuardComponent> {
    canDeactivate(component: GuardComponent, currentRoute: Route): Promise<boolean>;
}
