import { Directive } from "@angular/core";
import { Router } from "../Router";
import { UrlParser } from "../UrlParser";
/**
 * Intercept all document click on anchor href and perform router navigation
 */
var HandleHrefNavigationDirective = (function () {
    function HandleHrefNavigationDirective(router) {
        var _this = this;
        this.router = router;
        this.handler = function (event) {
            /*
             *  Взято из первого ангуляра
             */
            if (event.defaultPrevented) {
                return;
            }
            /* открытие в новом окне и т.п. не обрабатываем */
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2)
                return;
            var elm = event.target;
            // traverse the DOM up to find first A tag
            while (!elm.nodeName || elm.nodeName.toUpperCase() !== "A") {
                // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
                if (elm === document.body || !(elm = elm.parentElement))
                    return;
            }
            var navigateUrl = elm.getAttribute("href");
            /* не обрабатываем пустые ссылки,
             ссылки, открывающиеся в новом окне,
             ссылки на внешние ресурсы, а также ссылки с url-scheme приложений и на внешние url*/
            if (navigateUrl &&
                (elm.getAttribute("target") === "_blank" || /^\s*(javascript|mailto|tel|sip):/i.test(navigateUrl)) ||
                HandleHrefNavigationDirective.isExternalNavigation(navigateUrl)) {
                return;
            }
            event.preventDefault();
            if (navigateUrl) {
                _this.router.navigateByUrl(navigateUrl);
            }
        };
    }
    HandleHrefNavigationDirective.prototype.ngOnInit = function () {
        document.body.addEventListener("click", this.handler);
    };
    HandleHrefNavigationDirective.prototype.ngOnDestroy = function () {
        document.body.removeEventListener("click", this.handler);
    };
    HandleHrefNavigationDirective.isExternalNavigation = function (url) {
        var parsed = UrlParser.parseUrl(url);
        return isAbsUrl(url) && window.location.host !== parsed.host;
    };
    return HandleHrefNavigationDirective;
}());
export { HandleHrefNavigationDirective };
HandleHrefNavigationDirective.decorators = [
    { type: Directive, args: [{
                selector: "[handleHrefNavigation]"
            },] },
];
/** @nocollapse */
HandleHrefNavigationDirective.ctorParameters = function () { return [
    { type: Router, },
]; };
function isAbsUrl(url) {
    if (!url) {
        return false;
    }
    return (url.indexOf("https://") === 0 || url.indexOf("http://") === 0 || url.indexOf("//") === 0);
}
