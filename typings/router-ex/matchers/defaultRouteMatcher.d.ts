import { MatchedRouteResult, Route } from "../Config";
export declare function defaultRouteMatcher(url: string, route: Route): Promise<MatchedRouteResult>;
/**
 * Normalizes the given route template string, returning a regular expression representing a route
 * and the original path string.
 *
 * Inspired by pathRexp in visionmedia/express/lib/utils.js.
 * and angular/angular.js/blob/master/src/ngRoute/route.js
 */
export declare function parseRoute(routeUrl: string): ParsedRoute;
export interface ParsedRoute {
    regexp: RegExp;
    paramsMap: RouteParam[];
    path: string;
}
export interface RouteParam {
    name: string;
    optional: boolean;
}
