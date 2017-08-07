import {CanActivate, CanDeactivate, Route} from "../../../router-ex/";
import {GuardComponent} from "./guard.component";
import {Injectable} from "@angular/core";

let allow = false;

export function enableGuards() {
    allow = false;
}

export function disabledGuards() {
    allow = true;
}

@Injectable()
export class GuardOnActivate implements CanActivate {

    canActivate(route: Route): Promise<boolean> {
        console.log("activate", route);
        return new Promise((resolve) => setTimeout(() => {
            resolve(allow)
        }, 100));
    }

}

@Injectable()
export class GuardOnDeactivate implements CanDeactivate<GuardComponent> {

    canDeactivate(component: GuardComponent, currentRoute: Route): Promise<boolean> {
        console.log("deactivate", component, currentRoute);
        return new Promise((resolve) => setTimeout(() => {
            resolve(allow)
        }, 100));
    }

}
