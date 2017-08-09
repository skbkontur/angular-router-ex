import { InjectionToken } from "@angular/core";
export var ROUTE_CONFIG = new InjectionToken("router ex route config");
// ------- REUSE --------
export var ReuseRouteStrategy;
(function (ReuseRouteStrategy) {
    /**
     * Create only one instance of route component and allways reuse them
     */
    ReuseRouteStrategy[ReuseRouteStrategy["STICKY"] = 1] = "STICKY";
    /**
     * Reuse route componentn only when use return on the route by history pop event
     */
    ReuseRouteStrategy[ReuseRouteStrategy["CACHEBACK"] = 2] = "CACHEBACK";
})(ReuseRouteStrategy || (ReuseRouteStrategy = {}));
