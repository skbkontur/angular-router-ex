"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
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
RouterOutletMap.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
RouterOutletMap.ctorParameters = function () { return []; };
exports.RouterOutletMap = RouterOutletMap;
