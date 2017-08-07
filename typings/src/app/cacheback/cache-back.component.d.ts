import { OnDestroy } from "@angular/core";
import { Observable } from "rxjs";
import { IReusableRouterComponent, ReuseRouteStrategy, RouteContext, Router } from "../../../router-ex/";
export declare class CacheBackComponent implements IReusableRouterComponent, OnDestroy {
    private router;
    reuseRouteStrategy: ReuseRouteStrategy;
    onRouteCached(): void;
    onRouteReused(): void;
    ngOnDestroy(): void;
    id$: Observable<string>;
    qid$: Observable<string>;
    constructor(routeContext: RouteContext, router: Router);
    setQueryStringId(id: string): void;
}
