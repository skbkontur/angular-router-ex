import {CanDeactivate, Route} from "../../../src/";
import {DetailComponent} from "./detail.component";

export class DetailPageGuard implements CanDeactivate<DetailComponent> {

    canDeactivate(component: DetailComponent, currentRoute: Route): Promise<boolean> {
        return Promise.resolve(true);
    }

}
