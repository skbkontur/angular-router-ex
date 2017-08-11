import {Component, OnInit} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {IReusableRouterComponent, ReuseRouteStrategy, RouteContext} from "../../../src/";
import {Observable} from "rxjs";

@Component({
  selector: 'sticky',
  template: `<h1 tid="page-title">Sticky page</h1>
                <p>
                  currentId: <span tid="current-id">{{id$|async}}</span>
                </p>
                <ul>
                  <li><a tid="navigate-1" href="/sticky/1">Sticky 1</a></li>
                  <li><a tid="navigate-2" href="/sticky/2">Sticky 2</a></li>
                  <li><a tid="navigate-3" href="/sticky/3">Sticky 3</a></li>
                </ul>
                <p>
                  text: {{text}}
                </p>
                    <input [(ngModel)]="text" tid="sticky-input" type="text" />
                `
})
export class StickyComponent implements IReusableRouterComponent, OnInit {

  reuseRouteStrategy = ReuseRouteStrategy.STICKY;

  id$: Observable<string>;

  constructor(routeContext: RouteContext) {
    this.id$ = routeContext.routeParams.map(p => p["id"]);
  }


  ngOnInit() {
    console.log('sticky inited');
  }

  onRouteCached() {
    console.log('sticky detached');
  }

  onRouteReused() {
    console.log('sticky attached');
  }

}
