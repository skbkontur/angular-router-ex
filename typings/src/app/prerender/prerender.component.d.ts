import { OnInit } from "@angular/core";
import { IPrerenderRouterComponent, IReusableRouterComponent, ReuseRouteStrategy, Router } from "../../../router-ex/";
export declare class PrerenderComponent implements IPrerenderRouterComponent, IReusableRouterComponent, OnInit {
    private router;
    reuseRouteStrategy: ReuseRouteStrategy;
    prerenderText: string;
    constructor(router: Router);
    routePrerender(): Promise<any>;
    ngOnInit(): void;
}
