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
    getCacheFor(ref: ComponentRef<any>): ReuseCacheItem;
    getForCurrentPage(cmpType: Type<any>): ReuseCacheItem;
    private ensureCache(component, routeCtx);
    private getCurrentPageId();
    private newRouteNavigation();
}
export declare class ReuseCacheItem {
    scrollState: any;
    private _routeCtx;
    constructor(ref: ComponentRef<IReusableRouterComponent>, routeCtx: RouteContext, pageId?: string);
    private _pageIds;
    /**
     * Cached within specified pageIds
     */
    readonly pageIds: string[];
    private _ref;
    /**
     * Cached component reference
     */
    readonly ref: ComponentRef<IReusableRouterComponent>;
    readonly routeContext: RouteContext;
    readonly reuseStrategy: ReuseRouteStrategy;
    addPageId(pageId: string): void;
    attached(): void;
    destroy(): void;
    detached(): void;
    hasPageId(pageId: string): boolean;
}
