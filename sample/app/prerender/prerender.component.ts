import {Component, OnInit} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {IPrerenderRouterComponent, IReusableRouterComponent, ReuseRouteStrategy, Router} from "../../../src/";

@Component({
    selector: 'prerender',
    template: `<h1 tid="page-title">Prerender page</h1>
    <p tid="prerender-text">{{prerenderText}}</p>`
})
export class PrerenderComponent implements IPrerenderRouterComponent, IReusableRouterComponent, OnInit {
    reuseRouteStrategy = ReuseRouteStrategy.CACHEBACK;

    prerenderText: string;

    constructor(private router: Router) {

    }

    routePrerender(): Promise<any> {
        this.prerenderText = "prerendered";
        return new Promise(resolve => setTimeout(resolve, 3000));
    }

    ngOnInit(): void {
        //this.router.setQuery({action: "1"}, {replaceUrl:true});
    }


}
