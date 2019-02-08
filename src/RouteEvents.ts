import {ComponentRef} from "@angular/core";
import {RouteContext} from "./RouteContext";
export interface NavigationEvent {

}

export class NavigationStart implements NavigationEvent {
    constructor() {

    }
}

export class NavigationEnd implements NavigationEvent {

    // TODO какая информацию нужна в событиях? Проработать эту часть

    private _url: string;
    private _component: ComponentRef<any>;
    private _routeCtx: RouteContext;
    private _historyReplaced: boolean;

    constructor(url: string, component: ComponentRef<any>, routeCtx: RouteContext, _historyReplaced?: boolean) {
        this._url = url;
        this._component = component;
        this._routeCtx = routeCtx;
        this._historyReplaced = _historyReplaced;
    }

    get url(): string {
        return this._url;
    }

    get activatedComponent(): ComponentRef<any> {
        return this._component;
    }

    get routeContext(): RouteContext {
        return this._routeCtx;
    }

    get historyReplaced(): boolean {
        return this._historyReplaced;
    }

}

export class NavigationCancel implements NavigationEvent {

}
