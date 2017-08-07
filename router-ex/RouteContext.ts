import {Observable} from "rxjs/Observable";
import {ResolvedRoute, Route, QueryParams} from "./Config";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Injector} from "@angular/core";
import {isParamsEqual} from "./IsParamsEqual";

export type Params = {[key: string]: string};

export class RouteContext {

    private _queryParams: BehaviorSubject<QueryParams>;
    private _routeParams: BehaviorSubject<Params>;
    private _url: string;
    private _route: Route;
    private _injector: Injector;
    private _active = true;

    constructor(url: string, resolvedRoute: ResolvedRoute) {
        this.update(url, resolvedRoute);
    }

    get active(): boolean {
        return this._active;
    }

    get injector(): Injector {
        return this._injector;
    }

    get queryParams(): Observable<QueryParams> {
        return this._queryParams;
    }

    get queryParamsSnapshot(): QueryParams {
        return this._queryParams.getValue();
    }

    get routeParamsSnapshot(): QueryParams {
        return this._routeParams.getValue();
    }

    get routeParams(): Observable<Params> {
        return this._routeParams;
    }

    get url(): string {
        return this._url;
    }

    get route(): Route {
        return this._route;
    }

    deactivate() {
        this._active = false;
    }

    activate() {
        this._active = true;
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
