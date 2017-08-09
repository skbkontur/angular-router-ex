import { Attribute, Component, EventEmitter, Output, ReflectiveInjector, ViewContainerRef, ViewChild, Input } from "@angular/core";
import { RouteContext } from "../RouteContext";
import { RouterOutletMap } from "../RouterOutletMap";
import { fromPromise } from "rxjs/observable/fromPromise";
import { of } from "rxjs/observable/of";
import { delay } from "rxjs/operator/delay";
import { merge } from "rxjs/operator/merge";
import { ReuseRouteStrategy } from "../Config";
import { RouteReuseCache } from "../RouteReuseCache";
import { RouterScrollWrapper } from "../RouterScrollWrapper";
var RouterExOutletComponent = (function () {
    function RouterExOutletComponent(parentOutletMap, location, reuseCache, scrollWrapper, name) {
        this.parentOutletMap = parentOutletMap;
        this.location = location;
        this.reuseCache = reuseCache;
        this.scrollWrapper = scrollWrapper;
        this.name = name;
        this.prerenderFallback = 500;
        this.activateEvents = new EventEmitter();
        this.deactivateEvents = new EventEmitter();
        this.prerenderReadyEvents = new EventEmitter();
        parentOutletMap.register(this, name);
    }
    RouterExOutletComponent.prototype.ngOnDestroy = function () {
        this.parentOutletMap.unregister(this.name);
    };
    Object.defineProperty(RouterExOutletComponent.prototype, "isActivated", {
        get: function () {
            return !!this.activated;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RouterExOutletComponent.prototype, "activatedComponent", {
        get: function () {
            return this.activated;
        },
        enumerable: true,
        configurable: true
    });
    RouterExOutletComponent.prototype.activate = function (route, url, componentType, resolver, injector) {
        var _this = this;
        var cache = this.reuseCache.getForCurrentPage(componentType);
        if (cache) {
            // reuse existing component ref
            this.activateComponent(cache.ref);
            cache.attached();
            cache.ref.changeDetectorRef.detectChanges();
            if (cache.reuseStrategy === ReuseRouteStrategy.CACHEBACK) {
                this.scrollWrapper.setScrollState(cache.scrollState);
            }
            cache.routeContext.update(url, route);
            return Promise.resolve({
                routeContext: cache.routeContext
            });
        }
        var routeContext = new RouteContext(url, route);
        // create new instance of the component
        var factory = resolver.resolveComponentFactory(componentType);
        var bindings = ReflectiveInjector.resolve([
            { provide: RouteContext, useValue: routeContext }
        ]);
        var inj = ReflectiveInjector.fromResolvedProviders(bindings, injector);
        var componentToActivate = this.prerenderContainer.createComponent(factory, this.prerenderContainer.length, inj, []);
        var onDone = function () {
            componentToActivate.changeDetectorRef.detectChanges();
            if (_this.autoScroll) {
                _this.scrollWrapper.moveTop();
            }
        };
        var noPrerender = function () {
            // no prerender
            _this.prerenderContainer.detach();
            _this.activateComponent(componentToActivate);
            onDone();
            return Promise.resolve({
                routeContext: routeContext
            });
        };
        // need to prerender component ?
        if (componentToActivate.instance.routePrerender) {
            var rendered_1 = false;
            var routeReady_1 = componentToActivate.instance
                .routePrerender()
                .then(function () {
                _this.prerenderReadyEvents.emit(componentToActivate);
            }, function (err) {
                _this.prerenderReadyEvents.emit(componentToActivate);
                throw err;
            });
            if (this.activatedComponent) {
                return new Promise(function (resolve) {
                    var delay$ = delay.call(of(true), _this.prerenderFallback);
                    merge.call(fromPromise(routeReady_1), delay$)
                        .subscribe(function () {
                        if (rendered_1) {
                            return;
                        }
                        rendered_1 = true;
                        _this.prerenderContainer.detach();
                        _this.activateComponent(componentToActivate);
                        onDone();
                        resolve({ routeContext: routeContext });
                    });
                });
            }
            else {
                return noPrerender();
            }
        }
        else {
            return noPrerender();
        }
    };
    /**
     * Replace current activated component with specified one
     */
    RouterExOutletComponent.prototype.activateComponent = function (ref) {
        this.deactivateCurrent();
        this.attach(ref, null);
        this.activateEvents.emit(this.activated.instance);
        if (ref.instance.onRouteOutletActivated) {
            ref.instance.onRouteOutletActivated();
        }
    };
    RouterExOutletComponent.prototype.deactivateCurrent = function () {
        if (this.activated) {
            var c = this.activated.instance;
            var cache = this.reuseCache.getCacheFor(this.activated);
            if (this.activated.instance.onRouteOutletDeactivated) {
                this.activated.instance.onRouteOutletDeactivated();
            }
            if (cache) {
                this.location.detach();
                cache.detached();
            }
            else {
                this.activated.destroy();
            }
            this.activated = null;
            this.deactivateEvents.emit(c);
        }
    };
    RouterExOutletComponent.prototype.attach = function (ref, routeContext) {
        this.activated = ref;
        this.routeCtx = routeContext;
        this.location.insert(ref.hostView);
    };
    return RouterExOutletComponent;
}());
export { RouterExOutletComponent };
RouterExOutletComponent.decorators = [
    { type: Component, args: [{
                selector: "router-ex-outlet",
                styles: [":host { display: none;}"],
                template: "<div #placeholder></div>"
            },] },
];
/** @nocollapse */
RouterExOutletComponent.ctorParameters = function () { return [
    { type: RouterOutletMap, },
    { type: ViewContainerRef, },
    { type: RouteReuseCache, },
    { type: RouterScrollWrapper, },
    { type: undefined, decorators: [{ type: Attribute, args: ["name",] },] },
]; };
RouterExOutletComponent.propDecorators = {
    'autoScroll': [{ type: Input },],
    'prerenderFallback': [{ type: Input },],
    'activateEvents': [{ type: Output, args: ["onActivate",] },],
    'deactivateEvents': [{ type: Output, args: ["onDeactivate",] },],
    'prerenderReadyEvents': [{ type: Output, args: ["prerenderReady",] },],
    'prerenderContainer': [{ type: ViewChild, args: ["placeholder", { read: ViewContainerRef },] },],
};
