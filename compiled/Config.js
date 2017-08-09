"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
exports.ROUTE_CONFIG = new core_1.InjectionToken("router ex route config");
// ------- REUSE --------
var ReuseRouteStrategy;
(function (ReuseRouteStrategy) {
    /**
     * Create only one instance of route component and allways reuse them
     */
    ReuseRouteStrategy[ReuseRouteStrategy["STICKY"] = 1] = "STICKY";
    /**
     * Reuse route componentn only when use return on the route by history pop event
     */
    ReuseRouteStrategy[ReuseRouteStrategy["CACHEBACK"] = 2] = "CACHEBACK";
})(ReuseRouteStrategy = exports.ReuseRouteStrategy || (exports.ReuseRouteStrategy = {}));
