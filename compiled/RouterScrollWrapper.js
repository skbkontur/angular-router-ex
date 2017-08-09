"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RouterScrollWrapper = (function () {
    function RouterScrollWrapper() {
    }
    RouterScrollWrapper.prototype.getScrollState = function () {
        return window.pageYOffset || document.documentElement.scrollTop;
    };
    RouterScrollWrapper.prototype.setScrollState = function (position) {
        window.scrollTo(0, position);
    };
    RouterScrollWrapper.prototype.moveTop = function () {
        this.setScrollState(0);
    };
    return RouterScrollWrapper;
}());
exports.RouterScrollWrapper = RouterScrollWrapper;
