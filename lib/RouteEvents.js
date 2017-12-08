var NavigationStart = /** @class */ (function () {
    function NavigationStart() {
    }
    return NavigationStart;
}());
export { NavigationStart };
var NavigationEnd = /** @class */ (function () {
    function NavigationEnd(url, component, routeCtx) {
        this._url = url;
        this._component = component;
        this._routeCtx = routeCtx;
    }
    Object.defineProperty(NavigationEnd.prototype, "url", {
        get: function () {
            return this._url;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationEnd.prototype, "activatedComponent", {
        get: function () {
            return this._component;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationEnd.prototype, "routeContext", {
        get: function () {
            return this._routeCtx;
        },
        enumerable: true,
        configurable: true
    });
    return NavigationEnd;
}());
export { NavigationEnd };
var NavigationCancel = /** @class */ (function () {
    function NavigationCancel() {
    }
    return NavigationCancel;
}());
export { NavigationCancel };
