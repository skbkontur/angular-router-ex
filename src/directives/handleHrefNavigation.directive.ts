import {OnDestroy, Directive, OnInit} from "@angular/core";
import {Router} from "../Router";
import {UrlParser} from "../UrlParser";

/**
 * Intercept all document click on anchor href and perform router navigation
 */
@Directive({
    selector: "[handleHrefNavigation]"
})
export class HandleHrefNavigationDirective implements OnDestroy, OnInit {

    private handler = (event) => {
        /*
         *  Взято из первого ангуляра
         */

        if (event.defaultPrevented) {
            return;
        }

        /* открытие в новом окне и т.п. не обрабатываем */
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.which === 2 || event.button === 2) return;

        let elm = <HTMLElement>event.target;
        // traverse the DOM up to find first A tag
        while (!elm.nodeName || elm.nodeName.toUpperCase() !== "A") {
            // ignore rewriting if no A tag (reached root element, or no parent - removed from document)
            if (elm === document.body || !(elm = elm.parentElement)) return;
        }

        let navigateUrl = elm.getAttribute("href");


        /* не обрабатываем пустые ссылки,
         ссылки, открывающиеся в новом окне,
         ссылки на внешние ресурсы, а также ссылки с url-scheme приложений и на внешние url, а также #-ссылки на текущий документ */
        if (navigateUrl &&
            (elm.getAttribute("target") === "_blank" || /^\s*(javascript|mailto|tel|sip):/i.test(navigateUrl)) ||
              HandleHrefNavigationDirective.isExternalNavigation(navigateUrl) || navigateUrl[0] === '#') {
            return;
        }

        event.preventDefault();

        if (navigateUrl) {
            this.router.navigateByUrl(navigateUrl);
        }

    };

    constructor(private router: Router) {

    }

    ngOnInit(): void {
        document.body.addEventListener("click", this.handler);
    }

    ngOnDestroy() {
        document.body.removeEventListener("click", this.handler);
    }

    private static isExternalNavigation(url){
        const parsed = UrlParser.parseUrl(url);
        return isAbsUrl(url) && window.location.host !== parsed.host;
    }

}

function isAbsUrl(url: string): boolean {
    if (!url) {
        return false;
    }
    return (url.indexOf("https://") === 0 || url.indexOf("http://") === 0 || url.indexOf("//") === 0);
}
