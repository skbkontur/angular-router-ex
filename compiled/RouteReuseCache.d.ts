import { ComponentRef, InjectionToken, Type } from "@angular/core";
import { Router } from "./Router";
import { IReusableRouterComponent, ReuseRouteStrategy } from "./Config";
import { IPageIdLocationStrategy } from "./HistoryApiLocationStrategy";
import { RouteContext } from "./RouteContext";
import { RouterScrollWrapper } from "./RouterScrollWrapper";
export declare const REUSE_CACHE_CONSTRAINT: InjectionToken<ReuseCacheConstraint>;
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
export declare class RouteReuseCache {
    private router;
    private location;
    private cache;
    private newRouteNavigations;
    private lastRouteConfig;
    private currentCacheItem;
    private constraint;
    constructor(router: Router, constraint: any, location: IPageIdLocationStrategy, scrollWrapper: RouterScrollWrapper);
    getForCurrentPage(cmpType: Type<any>): ReuseCacheItem;
    getCacheFor(ref: ComponentRef<any>): ReuseCacheItem;
    private ensureCache(component, routeCtx);
    private newRouteNavigation();
    private getCurrentPageId();
}
export declare class ReuseCacheItem {
    private _pageIds;
    private _ref;
    private _routeCtx;
    scrollState: any;
    constructor(ref: ComponentRef<IReusableRouterComponent>, routeCtx: RouteContext, pageId?: string);
    /**
     * Cached within specified pageIds
     */
    readonly pageIds: string[];
    readonly routeContext: RouteContext;
    /**
     * Cached component reference
     */
    readonly ref: ComponentRef<IReusableRouterComponent>;
    readonly reuseStrategy: ReuseRouteStrategy;
    addPageId(pageId: string): void;
    hasPageId(pageId: string): boolean;
    detached(): void;
    attached(): void;
    destroy(): void;
}
