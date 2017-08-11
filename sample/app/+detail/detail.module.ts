import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { routes } from './detail.routes';
import { DetailComponent } from './detail.component';

import {DetailExtraComponent} from "./detail-extra.component";
import {DetailPageGuard} from "./DetailPageGuard";
import {RouterExModule} from "../../../src/";

console.log('`Detail` bundle loaded asynchronously');

@NgModule({
  declarations: [
    // Components / Directives/ Pipes
    DetailComponent,
    DetailExtraComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterExModule.forChild(routes),
  ],
  providers: [
    DetailPageGuard
  ]
})
export class DetailModule {
  public static routes = routes;
}
