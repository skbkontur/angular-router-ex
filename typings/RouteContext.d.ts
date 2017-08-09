import { Observable } from "rxjs/Observable";
import { ResolvedRoute, Route, QueryParams } from "./Config";
import { Injector } from "@angular/core";
export declare type Params = {
    [key: string]: string;
};
export declare class RouteContext {
    private _queryParams;
    private _routeParams;
    private _url;
    private _route;
    private _injector;
    private _active;
    constructor(url: string, resolvedRoute: ResolvedRoute);
    readonly active: boolean;
    readonly injector: Injector;
    readonly queryParams: Observable<QueryParams>;
    readonly queryParamsSnapshot: QueryParams;
    readonly routeParamsSnapshot: QueryParams;
    readonly routeParams: Observable<Params>;
    readonly url: string;
    readonly route: Route;
    deactivate(): void;
    activate(): void;
    update(url: string, resolvedRoute: ResolvedRoute): void;
}
