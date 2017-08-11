import {Component, OnDestroy} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {Observable} from "rxjs";
import {IReusableRouterComponent, ReuseRouteStrategy, RouteContext, Router} from "../../../src/";

@Component({
    selector: 'cache-back',
    templateUrl: './cache-back.html'
})
export class CacheBackComponent implements IReusableRouterComponent, OnDestroy {

    reuseRouteStrategy = ReuseRouteStrategy.CACHEBACK;

    onRouteCached() {
        console.log('cache back detached');
    }

    onRouteReused() {
        console.log('cache back attached');
    }

    ngOnDestroy(): void {
        console.log('cache back destroyed');
    }

    id$: Observable<string>;
    qid$: Observable<string>;

    constructor(routeContext: RouteContext, private router: Router) {
        this.id$ = routeContext.routeParams.map(p => p["id"]);
        this.qid$ = routeContext.queryParams.map(q => q["qid"]);
    }

    setQueryStringId(id: string) {
        this.router.setQuery({"qid": id});
    }

}
