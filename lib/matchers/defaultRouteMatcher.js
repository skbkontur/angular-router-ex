import { UrlParser } from "../";
export function defaultRouteMatcher(url, route) {
    //drop query string for matching
    url = UrlParser.parseUrl(url).pathname;
    var parsedRoute = parseRoute(route.path);
    var parsedUrl = url.match(parsedRoute.regexp);
    if (parsedUrl) {
        var params = {};
        for (var i = 0; i < parsedRoute.paramsMap.length; i++) {
            params[parsedRoute.paramsMap[i].name] = parsedUrl[1 + i];
        }
        return Promise.resolve({
            component: route.component,
            params: params,
            route: route
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
export function parseRoute(routeUrl) {
    var params = [];
    var result = {
        path: routeUrl,
        regexp: null,
        paramsMap: params
    };
    /* since our route table does not apply prefixes to url via forChild
         *  we should assume all routes start from root */
    if (routeUrl[0] !== "/") {
        routeUrl = "/" + routeUrl;
    }
    var path = routeUrl
        .replace(/([().])/g, "\\$1") // escape round brackets and dot with backslash
        .replace(/(\/)?:(\w+)(\*\?|[?*])?/g, function (_, slash, key, option) {
        // find parameters and    wildcards in string
        var optional = (option === "?" || option === "*?") ? "?" : null;
        var star = (option === "*" || option === "*?") ? "*" : null;
        params.push({ name: key, optional: !!optional });
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
