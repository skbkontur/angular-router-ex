import {Component} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {Observable} from "rxjs";
import {RouteContext} from "../../../src/";

@Component({
  selector: 'guard',
  template: `<h1 tid="page-title">Item page</h1>
                <p>
                  current id: <span tid="current-id">{{id$|async}}</span>
                </p>
                  <ul>
                      <li><a tid="navigate-1" href="/item/1">Item 1</a></li>
                      <li><a tid="navigate-2" href="/item/2">Item 2</a></li>
                      <li><a tid="navigate-3" href="/item/3">Item 3</a></li>
                  </ul>
                `
})
export class ItemComponent {

  id$: Observable<string>;

  constructor(routeContext: RouteContext) {
    this.id$ = routeContext.routeParams.map(p => p["id"]);
  }

}
