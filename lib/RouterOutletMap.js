import { Injectable } from "@angular/core";
var PRIMARY_OUTLET = "__router-ex-default";
var RouterOutletMap = (function () {
    function RouterOutletMap() {
        this.map = {};
    }
    RouterOutletMap.prototype.register = function (outlet, name) {
        this.map[name || PRIMARY_OUTLET] = outlet;
    };
    RouterOutletMap.prototype.unregister = function (name) {
        delete this.map[name];
    };
    RouterOutletMap.prototype.getOutlet = function (name) {
        return this.map[name || PRIMARY_OUTLET];
    };
    return RouterOutletMap;
}());
export { RouterOutletMap };
RouterOutletMap.decorators = [
    { type: Injectable },
];
/** @nocollapse */
RouterOutletMap.ctorParameters = function () { return []; };
