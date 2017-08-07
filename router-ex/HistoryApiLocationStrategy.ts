import {LocationStrategy, Location, PlatformLocation, APP_BASE_HREF, LocationChangeListener} from "@angular/common";
import {Optional, Inject, Injectable} from "@angular/core";

/**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
export class HistoryPageState {
  pageId: string;

  constructor(pageId: string) {
    this.pageId = pageId;
  }

  /**
   * Создает новое состояние с уникальным pageID
   */
  static createNew(): HistoryPageState {
    return new HistoryPageState(generateUniqueId());
  }
}

export interface IPageIdLocationStrategy {
  getCurrentPageId(): string;
}

@Injectable()
export class HistoryApiLocationStrategy extends LocationStrategy implements IPageIdLocationStrategy {

  private _baseHref: string;

  constructor(private _platformLocation: PlatformLocation,
              @Optional() @Inject(APP_BASE_HREF) href?: string) {
    super();

      if (href == null) {
          href = this._platformLocation.getBaseHrefFromDOM();
      }

      if (href == null) {
          console.warn(`No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.`);
          href= "/"; // TODO BUG после обновления до 4.0.0-rc.4 почему то перестал инджектится APP_BASE_HREF
      }

      this._baseHref = href;

  }

  getCurrentPageId(): string {
    return history.state ? history.state.pageId : undefined;
  }

  onPopState(fn: LocationChangeListener): void {
    this._platformLocation.onPopState(fn);
    this._platformLocation.onHashChange(fn);
  }

  getBaseHref(): string {
    return this._baseHref;
  }

  prepareExternalUrl(internal: string): string {
    return Location.joinWithSlash(this._baseHref, internal);
  }

  path(includeHash: boolean = false): string {
    const pathname = this._platformLocation.pathname +
      Location.normalizeQueryParams(this._platformLocation.search);
    const hash = this._platformLocation.hash;
    return hash && includeHash ? `${pathname}${hash}` : pathname;
  }

  pushState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
    this._platformLocation.pushState(HistoryPageState.createNew(), title, externalUrl);
    //resetPopedState();
  }

  replaceState(state: any, title: string, url: string, queryParams: string) {
    const externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
    this._platformLocation.replaceState(ensureHistoryState(), title, externalUrl);
    //resetPopedState();
  }

  forward(): void {
    this._platformLocation.forward();
  }

  back(): void {
    this._platformLocation.back();
  }

}

export function ensureHistoryState(state?: any): HistoryPageState {
  let currentState = state || window.history.state;
  if (!currentState) {
    currentState = HistoryPageState.createNew();
  }
  return currentState;
}

function generateUniqueId(): string {
  let idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
  do {
    // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
    let ascicode = Math.floor((Math.random() * 42) + 48);
    if (ascicode < 58 || ascicode > 64) {
      // exclude all chars between : (58) and @ (64)
      idstr += String.fromCharCode(ascicode);
    }
  } while (idstr.length < 5);
  return idstr;
}
