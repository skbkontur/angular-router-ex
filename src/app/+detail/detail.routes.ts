import {DetailComponent} from "./detail.component";
import {DetailExtraComponent} from "./detail-extra.component";
import {Routes} from "../../../router-ex/";
import {DetailPageGuard} from "./DetailPageGuard";

export const routes: Routes = [
  {path: '/detail', component: DetailComponent, canDeactivate: [DetailPageGuard]},
  {path: '/detail/extra/:id', component: DetailExtraComponent}
];
