import {BehaviorSubject, Observable} from "rxjs";
import {QueryParams, ResolvedRoute, Route} from "./Config";
import {Injector} from "@angular/core";
import {isParamsEqual} from "./IsParamsEqual";

export type Params = { readonly [key: string]: string };

export class RouteContext {

    constructor(url: string, resolvedRoute: ResolvedRoute) {
        this.update(url, resolvedRoute);
    }

    private _queryParams: BehaviorSubject<QueryParams>;

    get queryParams(): Observable<QueryParams> {
        return this._queryParams;
    }

    get outlet() {
        return this._route.outlet;
    }

    private _routeParams: BehaviorSubject<Params>;

    get routeParams(): Observable<Params> {
        return this._routeParams;
    }

    private _url: string;

    get url(): string {
        return this._url;
    }

    private _route: Route;

    get route(): Route {
        return this._route;
    }

    private _injector: Injector;

    get injector(): Injector {
        return this._injector;
    }

    private _active = true;

    get active(): boolean {
        return this._active;
    }

    get queryParamsSnapshot(): QueryParams {
        return this._queryParams.getValue();
    }

    get routeParamsSnapshot(): QueryParams {
        return this._routeParams.getValue();
    }

    activate() {
        this._active = true;
    }

    deactivate() {
        this._active = false;
    }

    update(url: string, resolvedRoute: ResolvedRoute) {
        //try to keep urls consistent
        this._url = url[0] !== "/" ? "/" + url : url; // TODO: Base Href вместо / ??

        if (!this._queryParams) {
            this._queryParams = new BehaviorSubject(resolvedRoute.queryParams); // TODO query params ??
        } else if (!isParamsEqual(this.queryParamsSnapshot, resolvedRoute.queryParams)) {
            this._queryParams.next(resolvedRoute.queryParams); // TODO query params ??
        }

        if (!this._routeParams) {
            this._routeParams = new BehaviorSubject(resolvedRoute.params);
        } else if (!isParamsEqual(this.routeParamsSnapshot, resolvedRoute.params, true)) {
            this._routeParams.next(resolvedRoute.params);
        }

        this._route = resolvedRoute.route;
        this._injector = resolvedRoute.injector;
    }
}
