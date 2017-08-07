import {ComponentRef, Inject, Injectable, InjectionToken, Type} from "@angular/core";
import {Router} from "./Router";
import {NavigationEnd, NavigationStart} from "./RouteEvents";
import {IReusableRouterComponent, ReuseRouteStrategy, Route} from "./Config";
import {LocationStrategy} from "@angular/common";
import {IPageIdLocationStrategy} from "./HistoryApiLocationStrategy";
import {RouteContext} from "./RouteContext";
import {RouterScrollWrapper} from "./RouterScrollWrapper";


export const REUSE_CACHE_CONSTRAINT = new InjectionToken<ReuseCacheConstraint>("Router reuse cache constraint");

export interface ReuseCacheConstraint {
    /**
     * Max cache sticky route instances
     */
    maxStickyRoutes: number;

    /**
     * Used for cache back routes.
     * Max history steps that this routes will stores in the cache
     */
    maxHistoryCacheDepth: number;
}

@Injectable()
export class RouteReuseCache {

    private cache: ReuseCacheItem[] = window["_cache"] = [];
    private newRouteNavigations: string[] = [];
    // to detect new route navigation
    private lastRouteConfig: Route;
    private currentCacheItem: ReuseCacheItem;
    private constraint: ReuseCacheConstraint;

    constructor(private router: Router,
                @Inject(REUSE_CACHE_CONSTRAINT) constraint: any,
                @Inject(LocationStrategy) private location: IPageIdLocationStrategy,
                scrollWrapper: RouterScrollWrapper) {

        this.constraint = constraint as ReuseCacheConstraint;

        if (location.getCurrentPageId) {
            router.events.subscribe((e: NavigationEvent) => {
                if (e instanceof NavigationEnd) {
                    this.currentCacheItem = this.ensureCache(e.activatedComponent, e.routeContext);

                    if (!this.lastRouteConfig || this.lastRouteConfig !== e.routeContext.route) {
                        this.newRouteNavigation();
                        this.lastRouteConfig = e.routeContext.route;
                    }
                } else if (e instanceof NavigationStart) {
                    if (this.currentCacheItem) {
                        this.currentCacheItem.scrollState = scrollWrapper.getScrollState();
                    }
                }
            });
        } else {
            console.warn(`Router will not reuse routes because your app use custom LocationStrategy which not provide information about page id`);
        }
    }

    getForCurrentPage(cmpType: Type<any>): ReuseCacheItem {

        const cacheItems = this.cache.filter(c => c.ref.componentType === cmpType);
        if (!cacheItems.length) {
            return undefined;// no cache
        }

        const pageId = this.getCurrentPageId();

        for (let cacheItem of cacheItems) {

            if (cacheItem.pageIds) {
                //cache back
                if (cacheItem.hasPageId(pageId)) {
                    return cacheItem;
                }
                continue;
            }

            return cacheItem; // sticky
        }

        return undefined;
    }

    getCacheFor(ref: ComponentRef<any>): ReuseCacheItem {
        return this.cache.find(c => c.ref === ref);
    }

    private ensureCache(component: ComponentRef<IReusableRouterComponent>, routeCtx: RouteContext): ReuseCacheItem {
        if (!component.instance.reuseRouteStrategy) {
            return undefined; // not a reusable component
        }

        const cacheBack = component.instance.reuseRouteStrategy === ReuseRouteStrategy.CACHEBACK;

        const pageId = this.getCurrentPageId();
        if (!pageId) {
            return undefined; // history api may not supoprted
        }

        let result: ReuseCacheItem;

        if (cacheBack) {
            let existCacheItems: ReuseCacheItem[] = this.cache.filter(c => c.ref.componentType === component.componentType);

            for (let cacheItem of existCacheItems) {
                if (cacheItem.ref.instance === component.instance) {
                    cacheItem.addPageId(pageId);
                    return cacheItem;
                }
            }

            result = new ReuseCacheItem(component, routeCtx, pageId);
            this.cache.push(result);

        } else {
            const existsSticky = this.cache.some(c => c.ref.componentType === component.componentType);
            if (!existsSticky) {
                result = new ReuseCacheItem(component, routeCtx);
                this.cache.push(result);
            }
        }

        return result;

    }

    private newRouteNavigation() {
        // removes cache which out of constraint

        this.newRouteNavigations.push(this.getCurrentPageId());

        if (this.newRouteNavigations.length > this.constraint.maxHistoryCacheDepth + 1 /* include current navigation */) {
            this.newRouteNavigations.shift();
        }

        let cacheItemsToDrop: ReuseCacheItem[] = [], stickyRoutesUsed = 0;

        for (const cacheItem of this.cache) {
            if (cacheItem.reuseStrategy === ReuseRouteStrategy.CACHEBACK) {
                if (this.newRouteNavigations.every(n => !cacheItem.hasPageId(n))) {
                    cacheItemsToDrop.push(cacheItem);
                }
            } else {
                stickyRoutesUsed++;
                if (stickyRoutesUsed > this.constraint.maxStickyRoutes) {
                    cacheItemsToDrop.push(cacheItem);
                }
            }
        }

        for (let cacheToDrop of cacheItemsToDrop) {
            cacheToDrop.destroy();
            this.cache.splice(this.cache.indexOf(cacheToDrop), 1);
        }


    }

    private getCurrentPageId(): string {
        return this.location.getCurrentPageId();
    }

}


export class ReuseCacheItem {

    private _pageIds: string[];
    private _ref: ComponentRef<IReusableRouterComponent>;
    private _routeCtx: RouteContext;

    public scrollState: any;

    constructor(ref: ComponentRef<IReusableRouterComponent>,
                routeCtx: RouteContext,
                pageId?: string) {
        if (pageId) {
            this._pageIds = [pageId];
        }
        this._ref = ref;
        this._routeCtx = routeCtx;
    }

    /**
     * Cached within specified pageIds
     */
    get pageIds(): string[] {
        return this._pageIds;
    }

    get routeContext(): RouteContext {
        return this._routeCtx;
    }

    /**
     * Cached component reference
     */
    get ref(): ComponentRef<IReusableRouterComponent> {
        return this._ref;
    }

    get reuseStrategy(): ReuseRouteStrategy {
        return this._ref.instance.reuseRouteStrategy;
    }

    addPageId(pageId: string) {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }

        if (!this._pageIds) {
            this._pageIds = [];
        }

        if (this.hasPageId(pageId)) {
            return;
        }

        this._pageIds.push(pageId);
    }

    hasPageId(pageId: string): boolean {
        if (!this._pageIds) {
            return false;
        }
        return this._pageIds.indexOf(pageId) >= 0;
    }

    detached() {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }

        if (this.ref.instance.onRouteCached) {
            this.ref.instance.onRouteCached();
        }
        this.routeContext.deactivate();
    }

    attached() {
        if (!this._ref) {
            throw new Error("Route cache item was destroyed");
        }
        if (this.ref.instance.onRouteReused) {
            this.ref.instance.onRouteReused();
        }
        this.routeContext.activate();
    }

    destroy() {
        if (this._ref) {
            this._ref.destroy();
            this._ref = null;
        }
    }

}
