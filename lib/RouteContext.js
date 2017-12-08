import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { isParamsEqual } from "./IsParamsEqual";
var RouteContext = /** @class */ (function () {
    function RouteContext(url, resolvedRoute) {
        this._active = true;
        this.update(url, resolvedRoute);
    }
    Object.defineProperty(RouteContext.prototype, "active", {
        get: function () {
            return this._active;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "injector", {
        get: function () {
            return this._injector;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "queryParams", {
        get: function () {
            return this._queryParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "queryParamsSnapshot", {
        get: function () {
            return this._queryParams.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "routeParamsSnapshot", {
        get: function () {
            return this._routeParams.getValue();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "routeParams", {
        get: function () {
            return this._routeParams;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouteContext.prototype, "route", {
        get: function () {
            return this._route;
        },
        enumerable: true,
        configurable: true
    });
    RouteContext.prototype.deactivate = function () {
        this._active = false;
    };
    RouteContext.prototype.activate = function () {
        this._active = true;
    };
    RouteContext.prototype.update = function (url, resolvedRoute) {
        //try to keep urls consistent
        this._url = url[0] !== "/" ? "/" + url : url; // TODO: Base Href вместо / ??
        if (!this._queryParams) {
            this._queryParams = new BehaviorSubject(resolvedRoute.queryParams); // TODO query params ??
        }
        else if (!isParamsEqual(this.queryParamsSnapshot, resolvedRoute.queryParams)) {
            this._queryParams.next(resolvedRoute.queryParams); // TODO query params ??
        }
        if (!this._routeParams) {
            this._routeParams = new BehaviorSubject(resolvedRoute.params);
        }
        else if (!isParamsEqual(this.routeParamsSnapshot, resolvedRoute.params, true)) {
            this._routeParams.next(resolvedRoute.params);
        }
        this._route = resolvedRoute.route;
        this._injector = resolvedRoute.injector;
    };
    return RouteContext;
}());
export { RouteContext };
