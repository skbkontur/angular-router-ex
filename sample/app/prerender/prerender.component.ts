import {Component, OnInit} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {
    IPrerenderRouterComponent, IReusableRouterComponent, ReuseRouteStrategy, RouteContext,
    Router
} from "../../../src/";

@Component({
    selector: 'prerender',
    template: `<h1 tid="page-title">Prerender page</h1>
    <p tid="prerender-text">{{prerenderText}}</p>`
})
export class PrerenderComponent implements IPrerenderRouterComponent, IReusableRouterComponent, OnInit {
    reuseRouteStrategy = ReuseRouteStrategy.CACHEBACK;

    prerenderText: string;
    fallbackTimeout: number;


    constructor(private router: Router, private routerCtx: RouteContext) {
        routerCtx.queryParams.subscribe(params => {
            this.fallbackTimeout = params["prerenderTimeout"] ? parseInt(params["prerenderTimeout"] as string) : undefined;
        });

    }

    routePrerender(): Promise<any> {
        this.prerenderText = "prerendered";
        if (!this.fallbackTimeout) {
            return new Promise(resolve => setTimeout(resolve, 3000));
        } else return new Promise(()=>{});
    }
    ngOnInit(): void {
        //this.router.setQuery({action: "1"}, {replaceUrl:true});
    }


}
