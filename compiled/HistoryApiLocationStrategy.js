"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var common_1 = require("@angular/common");
var core_1 = require("@angular/core");
/**
 * Состояние, которое сохраняется в HISTORY STATE
 *
 * @property {boolean} pageId Уникальный идентификатор страницы в истории браузера
 */
var HistoryPageState = (function () {
    function HistoryPageState(pageId) {
        this.pageId = pageId;
    }
    /**
     * Создает новое состояние с уникальным pageID
     */
    HistoryPageState.createNew = function () {
        return new HistoryPageState(generateUniqueId());
    };
    return HistoryPageState;
}());
exports.HistoryPageState = HistoryPageState;
var HistoryApiLocationStrategy = (function (_super) {
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
        return common_1.Location.joinWithSlash(this._baseHref, internal);
    };
    HistoryApiLocationStrategy.prototype.path = function (includeHash) {
        if (includeHash === void 0) { includeHash = false; }
        var pathname = this._platformLocation.pathname +
            common_1.Location.normalizeQueryParams(this._platformLocation.search);
        var hash = this._platformLocation.hash;
        return hash && includeHash ? "" + pathname + hash : pathname;
    };
    HistoryApiLocationStrategy.prototype.pushState = function (state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + common_1.Location.normalizeQueryParams(queryParams));
        this._platformLocation.pushState(HistoryPageState.createNew(), title, externalUrl);
        //resetPopedState();
    };
    HistoryApiLocationStrategy.prototype.replaceState = function (state, title, url, queryParams) {
        var externalUrl = this.prepareExternalUrl(url + common_1.Location.normalizeQueryParams(queryParams));
        this._platformLocation.replaceState(ensureHistoryState(), title, externalUrl);
        //resetPopedState();
    };
    HistoryApiLocationStrategy.prototype.forward = function () {
        this._platformLocation.forward();
    };
    HistoryApiLocationStrategy.prototype.back = function () {
        this._platformLocation.back();
    };
    return HistoryApiLocationStrategy;
}(common_1.LocationStrategy));
HistoryApiLocationStrategy.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
HistoryApiLocationStrategy.ctorParameters = function () { return [
    { type: common_1.PlatformLocation, },
    { type: undefined, decorators: [{ type: core_1.Optional }, { type: core_1.Inject, args: [common_1.APP_BASE_HREF,] },] },
]; };
exports.HistoryApiLocationStrategy = HistoryApiLocationStrategy;
function ensureHistoryState(state) {
    var currentState = state || window.history.state;
    if (!currentState) {
        currentState = HistoryPageState.createNew();
    }
    return currentState;
}
exports.ensureHistoryState = ensureHistoryState;
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
