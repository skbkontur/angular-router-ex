import { OnInit } from "@angular/core";
import { IReusableRouterComponent, ReuseRouteStrategy, RouteContext } from "../../../router-ex/";
import { Observable } from "rxjs";
export declare class StickyComponent implements IReusableRouterComponent, OnInit {
    reuseRouteStrategy: ReuseRouteStrategy;
    id$: Observable<string>;
    constructor(routeContext: RouteContext);
    ngOnInit(): void;
    onRouteCached(): void;
    onRouteReused(): void;
}
