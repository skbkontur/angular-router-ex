import {MatchedRouteResult, Route} from "../Config";
import {UrlParser} from "../UrlParser";


export function defaultRouteMatcher(url: string, route: Route): Promise<MatchedRouteResult> {

    //drop query string for matching
    url = UrlParser.parseUrl(url).pathname;

    let parsedRoute = parseRoute(route.path);
    let parsedUrl = url.match(parsedRoute.regexp);

    if (parsedUrl) {
        let params = {};

        for (let i = 0; i < parsedRoute.paramsMap.length; i++) {
            params[parsedRoute.paramsMap[i].name] = parsedUrl[1 + i];
        }

        return Promise.resolve({
            component: route.component,
            params,
            route
        });
    }

    return Promise.resolve(null);
}


/**
 * Normalizes the given route template string, returning a regular expression representing a route
 * and the original path string.
 *
 * Inspired by pathRexp in visionmedia/express/lib/utils.js.
 * and angular/angular.js/blob/master/src/ngRoute/route.js
 */
export function parseRoute(routeUrl: string): ParsedRoute {

    let params: RouteParam[] = [];
    let result: ParsedRoute = {
        path: routeUrl,
        regexp: null,
        paramsMap: params
    };

    /* since our route table does not apply prefixes to url via forChild
     *  we should assume all routes start from root */
    if (routeUrl[0] !== "/") {
        routeUrl = "/" + routeUrl;
    }

    let path = routeUrl
        .replace(/([().])/g, "\\$1") // escape round brackets and dot with backslash
        .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {    // find parameters and    wildcards in string
            let optional = (option === "?" || option === "*?") ? "?" : null;
            let star = (option === "*" || option === "*?") ? "*" : null;
            params.push({name: key, optional: !!optional});
            slash = slash || "";
            return ""
                + (optional ? "" : slash)
                + "(?:"
                + (optional ? slash : "")
                + (star && "(.+?)" || "([^/]+)")
                + (optional || "")
                + ")"
                + (optional || "");
        })
        .replace(/([/$*])/g, "\\$1");

    result.regexp = new RegExp("^" + path + "\/?$"); // support trailing slash
    return result;
}


export interface ParsedRoute {
    regexp: RegExp;
    paramsMap: RouteParam[];
    path: string;
}

export interface RouteParam {
    name: string;
    optional: boolean;
}
