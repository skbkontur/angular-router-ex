import {Inject, Injectable, Injector, Optional} from "@angular/core";
import {APP_BASE_HREF, Location} from "@angular/common";
import {RouteMatchService} from "./RouteMatchService";
import {Observable, Subject, Subscription} from "rxjs";
import {IRouterOutlet, RouterOutletMap} from "./RouterOutletMap";
import {MatchedRouteResult, NavigationExtras, QueryParams, ResolvedRoute, Route, ROUTE_CONFIG, Routes} from "./Config";
import {CanActivate, CanDeactivate} from "./Guards";
import {NavigationCancel, NavigationEnd, NavigationEvent, NavigationStart} from "./RouteEvents";
import {RouteContext} from "./RouteContext";
import {QueryStringParser} from "./QueryStringParser";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {concatMap} from "rxjs/operator/concatMap";
import {of} from "rxjs/observable/of";
import {isParamsEqual} from "./IsParamsEqual";
import {UrlParser} from "./UrlParser";

declare let Zone: any;

@Injectable()
export class Router {

    private resolvedRoutes: { [path: string]: MatchedRouteResult } = {};
    private locationSubscription: Subscription;
    private navigationId: number = 0;
    private currentContext: RouteContext;
    private navigations = new BehaviorSubject<NavigationParams>(null);
    private navigating: boolean;

    constructor(private outletMap: RouterOutletMap,
                private matchService: RouteMatchService,
                private location: Location,
                private injector: Injector,
                private queryStringParser: QueryStringParser,
                @Optional() @Inject(APP_BASE_HREF) private baseHref: string) {

        if (!this.baseHref) {
            this.baseHref = "/";
        }

        this.processNavigations();
    }

    get queryParamsSnapshot(): QueryParams {
        return this._queryParams.getValue();
    }

    private _queryParams: BehaviorSubject<QueryParams>;

    get queryParams(): Observable<QueryParams> {
        return this._queryParams;
    }

    private _events = new Subject<NavigationEvent>();

    get events(): Observable<NavigationEvent> {
        return this._events;
    }

    private static stripTrailingSlash(url: string): string {
        return url[url.length - 1] === "/" ? url.slice(0, -1) : url;
    }

    private static urlEquals(url1: string, url2: string): boolean {
        url1 = Router.stripTrailingSlash(url1);
        url2 = Router.stripTrailingSlash(url2);

        return decodeURIComponent(url1) === decodeURIComponent(url2);
    }

    initialNavigation() {
        this.setUpLocationChangeListener();

        if (this.navigationId === 0) {
            this.navigateByUrl(this.location.path(true), {replaceUrl: true});
        }
    }

    navigateByUrl(url: string, extras?: NavigationExtras): Promise<any> {
        // absolute url
        if (url.indexOf("https://") === 0 || url.indexOf("http://") === 0 || url.indexOf("//") === 0) {
            const requestedUrl = UrlParser.parseUrl(url);

            if (window.location
                && window.location.host == requestedUrl.host
                && window.location.protocol == requestedUrl.protocol) {
                // это наш хост, выбросим часть маршрута
                url = requestedUrl.pathname + requestedUrl.search + requestedUrl.hash

            } else {
                throw new Error('Router: cannot navigate to external url');
            }
        } else if (url[0] !== "/") {
            // add base href
            url = this.baseHref + url;
        }


        if ((extras && !extras.force) && this.currentContext && url === this.currentContext.url) {
            // navigation within same url
            return Promise.resolve(true);
        }

        // schedule

        return this.navigateInternal(url, extras);


    }

    reload(): Promise<boolean> {
        if (!this.currentContext) {
            return Promise.resolve(false);
        }
        return this.navigateByUrl(this.currentContext.url, {replaceUrl: true, force: true});
    }

    setQuery(p: QueryParams, navigationExtras?: NavigationExtras): Promise<any> {
        if (this.navigating) {
            return Promise.resolve(null);
        }
        const queryParams = this.queryStringParser.serialize(p);
        const urlParts = UrlParser.parseUrl(this.location.path(true));
        const newUrl = queryParams.length ? urlParts.pathname + "?" + queryParams : urlParts.pathname;

        return this.navigateByUrl(newUrl, navigationExtras);
    }

    setUpLocationChangeListener(): void {
        // Zone.current.wrap is needed because of the issue with RxJS scheduler,
        // which does not work properly with zone.js in IE and Safari
        if (!
                this.locationSubscription
        ) {
            this.locationSubscription = <any>this.location.subscribe(Zone.current.wrap((change: any) => {
                this.navigateByUrl(change["url"], {replaceUrl: true});
            }));
        }
    }

    updateQuery(p: QueryParams, navigationExtras?: NavigationExtras): Promise<any> {

        let existingParams = {
            ...this.queryParamsSnapshot,
            ...p
        };

        return this.setQuery(existingParams, navigationExtras);
    }

    private checkDeactivate(currentRoute: Route, injector: Injector): Promise<boolean> {
        if (!
                currentRoute.canDeactivate
        ) {
            return Promise.resolve(true);
        }

        const outlet = this.outletMap.getOutlet(currentRoute.outlet);
        const results = [];
        for (let guardType of currentRoute.canDeactivate) {
            const guard = injector.get(guardType) as CanDeactivate<any>;
            results.push(guard.canDeactivate(outlet.activatedComponent, currentRoute));
        }

        return Promise.all(results).then(all => {
            return !all.some(r => !r);
        });
    }

    private checkGuards(newRoute: ResolvedRoute): Promise<CheckGuardsResult> {
        let deactivation = this.currentContext ? this.checkDeactivate(this.currentContext.route, this.currentContext.injector) : Promise.resolve(true);
        // check deactivation first
        return deactivation.then(success => {
            if (!success) {
                return {resolvedRoute: newRoute, success: false};
            }
            // check activation
            return checkActivate(newRoute.route, newRoute.injector).then(success => {
                return {resolvedRoute: newRoute, success: success};
            })
        });
    }

    private executeScheduledNavigation({extras, id, url}: NavigationParams): Promise<any> {

        const force = extras && extras.force;

        if (this.currentContext && (!force && Router.urlEquals(url, this.currentContext.url))) {
            // drop same navigation
            return Promise.resolve(true);
        }

        const shouldReplaceUrl = extras ? extras.replaceUrl : false;
        const config = this.injector.get(ROUTE_CONFIG);

        this.navigating = true;

        this._events.next(new NavigationStart());

        let navigationCanceled: boolean, shouldActivate = true, outlet: IRouterOutlet;

        return this.matchRoute(url, config)
            .then(route => this.resolveRoute(url, route))
            .then((resolvedRoute: ResolvedRoute): any => {
                if (this.navigationId !== id) {
                    // navigation changes while resolving
                    navigationCanceled = true;
                    return undefined;
                }

                if (this.currentContext && this.currentContext.route.path === resolvedRoute.route.path) {
                    // navigating with same route
                    shouldActivate = force;
                    this.currentContext.update(url, resolvedRoute);
                    return {resolvedRoute, success: true};
                }

                // set url params to match its parsed state
                if (resolvedRoute.url !== url) {
                    url = resolvedRoute.url;
                }

                // check guards if routes changes
                return this.checkGuards(resolvedRoute);
            })
            .then((checkGuardsResult: CheckGuardsResult) => {

                if (this.navigationId !== id) {
                    // navigation changes while resolving or guard checking
                    navigationCanceled = true;
                    return this.currentContext;
                }

                if (checkGuardsResult.success) {

                    // we should change location state before activate outlet
                    if (shouldReplaceUrl) {
                        this.location.replaceState(url);
                    } else {
                        this.location.go(url);
                    }

                    outlet = this.outletMap.getOutlet(checkGuardsResult.resolvedRoute.route.outlet);

                    const resolvedRoute = checkGuardsResult.resolvedRoute;

                    if (shouldActivate) {
                        // new route navigation
                        return outlet.activate(
                            resolvedRoute,
                            url,
                            resolvedRoute.component,
                            resolvedRoute.factoryResolver,
                            resolvedRoute.injector,
                            force
                        ).then(result => result.routeContext);
                    }
                }
                else {
                    // guard blocked navigation
                    this.resetUrlToCurrent();
                    navigationCanceled = true;
                }

                return this.currentContext;
            })
            .then((routeContext: RouteContext) => {
                this.currentContext = routeContext;
            })
            .then(() => {
                this.navigating = false;

                if (navigationCanceled) {
                    this._events.next(new NavigationCancel());
                    return;
                }

                // make sure queryParams changed before pushing to observable
                if (!isParamsEqual(this.queryParamsSnapshot, this.currentContext.queryParamsSnapshot)) {
                    this._queryParams.next(this.currentContext.queryParamsSnapshot);
                }
                this._events.next(new NavigationEnd(url, outlet.activatedComponent, this.currentContext));

            })
            .catch((e) => {
                this.navigating = false;
                throw e;
            });
    }

    private matchRoute(url: string, config: Routes): Promise<MatchedRouteResult> {

        const path = UrlParser.parseUrl(url).pathname;

        if (!this.resolvedRoutes[path]) {
            return this.matchService.findRoute(url, config).then(route => {
                if (!route.noCache) {
                    this.resolvedRoutes[path] = route;
                }
                return route;
            });
        } else {
            return Promise.resolve(this.resolvedRoutes[path]);
        }

    }

    private navigateInternal(url: string, extras: NavigationExtras): Promise<boolean> {

        let resolve = null, reject = null;
        const result = new Promise<boolean>((r, rej) => {
            resolve = r;
            reject = rej;
        });

        this.scheduleNavigation({
            extras: extras,
            id: ++this.navigationId,
            promise: result,
            resolve,
            reject,
            url: url
        });

        return result;
    }

    private processNavigations() {
        concatMap
            .call(
                this.navigations,
                (nav: NavigationParams) => {
                    if (nav) {
                        return this.executeScheduledNavigation(nav).then(nav.resolve, nav.reject);
                    } else {
                        return <any>of(null);
                    }
                })
            .subscribe(() => {
            });

        // initial query string
        const queryString = UrlParser.parseUrl(this.location.path(true)).search;
        this._queryParams = new BehaviorSubject<QueryParams>(this.queryStringParser.parse(queryString))
    }

    private resetUrlToCurrent(): void {
        if (this.currentContext
        ) {
            this.location.replaceState(this.currentContext.url);
        }
        else {
            // TODO ситуация когда пользователь сразу переходит на защищенный маршрут
        }
    }

    private resolveRoute(originalUrl: string, route: MatchedRouteResult): ResolvedRoute {
        let urlParts = UrlParser.parseUrl(originalUrl);

        let queryParams = {};

        if (urlParts.search.length > 0) {
            // set url params to match its parsed state
            queryParams = this.queryStringParser.parse(urlParts.search);
            const qs = this.queryStringParser.serialize(queryParams);
            originalUrl = urlParts.pathname + (qs.length ? "?" + qs : "");
        }

        return {
            component: route.component,
            params: route.params,
            factoryResolver: route.factoryResolver,
            injector: route.injector || this.injector,
            route: route.route,
            queryParams,
            url: originalUrl
        }
    }

    private scheduleNavigation(nav: NavigationParams) {
        this.navigations.next(nav);
    }
}

function checkActivate(newRoute: Route, injector: Injector): Promise<boolean> {
    if (!
            newRoute.canActivate
    ) {
        return Promise.resolve(true);
    }

    const results = [];
    for (let guardType of newRoute.canActivate) {
        const guard = injector.get(guardType) as CanActivate;
        results.push(guard.canActivate(newRoute));
    }

    return Promise.all(results).then(all => {
        return !all.some(r => !r);
    });
}

interface CheckGuardsResult {
    resolvedRoute: ResolvedRoute;
    success: boolean;
}

interface NavigationParams {
    id: number,
    url: string;
    extras: NavigationExtras,
    resolve: any,
    reject: any,
    promise: Promise<boolean>
}
