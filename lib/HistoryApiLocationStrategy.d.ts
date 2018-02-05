import { LocationStrategy, PlatformLocation, LocationChangeListener } from "@angular/common";
/**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
export declare class HistoryPageState {
    pageId: string;
    constructor(pageId: string);
    /**
     * Создает новое состояние с уникальным pageID
     */
    static createNew(): HistoryPageState;
}
export interface IPageIdLocationStrategy {
    getCurrentPageId(): string;
}
export declare class HistoryApiLocationStrategy extends LocationStrategy implements IPageIdLocationStrategy {
    private _platformLocation;
    private _baseHref;
    constructor(_platformLocation: PlatformLocation, href?: string);
    getCurrentPageId(): string;
    onPopState(fn: LocationChangeListener): void;
    getBaseHref(): string;
    prepareExternalUrl(internal: string): string;
    path(includeHash?: boolean): string;
    pushState(state: any, title: string, url: string, queryParams: string): void;
    replaceState(state: any, title: string, url: string, queryParams: string): void;
    forward(): void;
    back(): void;
}
export declare function ensureHistoryState(state?: any): HistoryPageState;
export declare function generateUniqueId(): string;
