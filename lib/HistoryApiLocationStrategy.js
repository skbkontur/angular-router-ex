import * as tslib_1 from "tslib";
import { LocationStrategy, Location, PlatformLocation, APP_BASE_HREF } from "@angular/common";
import { Optional, Inject, Injectable } from "@angular/core";
/**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
var /**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
HistoryPageState = /** @class */ (function () {
    function HistoryPageState(pageId) {
        this.pageId = pageId;
    }
    /**
     * Создает новое состояние с уникальным pageID
     */
    /**
       * Создает новое состояние с уникальным pageID
       */
    HistoryPageState.createNew = /**
       * Создает новое состояние с уникальным pageID
       */
    function () {
        return new HistoryPageState(generateUniqueId());
    };
    return HistoryPageState;
}());
/**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
export { HistoryPageState };
var HistoryApiLocationStrategy = /** @class */ (function (_super) {
    tslib_1.__extends(HistoryApiLocationStrategy, _super);
    function HistoryApiLocationStrategy(_platformLocation, href) {
        var _this = _super.call(this) || this;
        _this._platformLocation = _platformLocation;
        if (href == null) {
            href = _this._platformLocation.getBaseHrefFromDOM();
        }
        if (href == null) {
            console.warn("No base href set. Please provide a value for the APP_BASE_HREF token or add a base element to the document.");
            href = "/"; // TODO BUG после обновления до 4.0.0-rc.4 почему то перестал инджектится APP_BASE_HREF
        }
        _this._baseHref = href;
        return _this;
    }
    HistoryApiLocationStrategy.prototype.getCurrentPageId = function () {
        return history.state ? history.state.pageId : undefined;
    };
    HistoryApiLocationStrategy.prototype.onPopState = function (fn) {
        this._platformLocation.onPopState(fn);
        this._platformLocation.onHashChange(fn);
    };
    HistoryApiLocationStrategy.prototype.getBaseHref = function () {
        return this._baseHref;
    };
    HistoryApiLocationStrategy.prototype.prepareExternalUrl = function (internal) {
        return Location.joinWithSlash(this._baseHref, internal);
    };
    HistoryApiLocationStrategy.prototype.path = function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        var pathname = this._platformLocation.pathname +
            Location.normalizeQueryParams(this._platformLocation.search);
        var hash = this._platformLocation.hash;
        return hash && includeHash ? "" + pathname + hash : pathname;
    };
    HistoryApiLocationStrategy.prototype.pushState = function (state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
        this._platformLocation.pushState(HistoryPageState.createNew(), title, externalUrl);
        //resetPopedState();
    };
    HistoryApiLocationStrategy.prototype.replaceState = function (state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + Location.normalizeQueryParams(queryParams));
        this._platformLocation.replaceState(ensureHistoryState(), title, externalUrl);
        //resetPopedState();
    };
    HistoryApiLocationStrategy.prototype.forward = function () {
        this._platformLocation.forward();
    };
    HistoryApiLocationStrategy.prototype.back = function () {
        this._platformLocation.back();
    };
    HistoryApiLocationStrategy.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    HistoryApiLocationStrategy.ctorParameters = function () { return [
        { type: PlatformLocation, },
        { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [APP_BASE_HREF,] },] },
    ]; };
    return HistoryApiLocationStrategy;
}(LocationStrategy));
export { HistoryApiLocationStrategy };
export function ensureHistoryState(state) {
    var currentState = state || window.history.state;
    if (!currentState) {
        currentState = HistoryPageState.createNew();
    }
    return currentState;
}
function generateUniqueId() {
    var idstr = String.fromCharCode(Math.floor((Math.random() * 25) + 65));
    do {
        // between numbers and characters (48 is 0 and 90 is Z (42-48 = 90)
        var ascicode = Math.floor((Math.random() * 42) + 48);
        if (ascicode < 58 || ascicode > 64) {
            // exclude all chars between : (58) and @ (64)
            idstr += String.fromCharCode(ascicode);
        }
    } while (idstr.length < 5);
    return idstr;
}
