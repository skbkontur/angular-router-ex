"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var RouteContext_1 = require("../RouteContext");
var RouterOutletMap_1 = require("../RouterOutletMap");
var fromPromise_1 = require("rxjs/observable/fromPromise");
var of_1 = require("rxjs/observable/of");
var delay_1 = require("rxjs/operator/delay");
var merge_1 = require("rxjs/operator/merge");
var Config_1 = require("../Config");
var RouteReuseCache_1 = require("../RouteReuseCache");
var RouterScrollWrapper_1 = require("../RouterScrollWrapper");
var RouterExOutletComponent = (function () {
    function RouterExOutletComponent(parentOutletMap, location, reuseCache, scrollWrapper, name) {
        this.parentOutletMap = parentOutletMap;
        this.location = location;
        this.reuseCache = reuseCache;
        this.scrollWrapper = scrollWrapper;
        this.name = name;
        this.prerenderFallback = 500;
        this.activateEvents = new core_1.EventEmitter();
        this.deactivateEvents = new core_1.EventEmitter();
        this.prerenderReadyEvents = new core_1.EventEmitter();
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
            if (cache.reuseStrategy === Config_1.ReuseRouteStrategy.CACHEBACK) {
                this.scrollWrapper.setScrollState(cache.scrollState);
            }
            cache.routeContext.update(url, route);
            return Promise.resolve({
                routeContext: cache.routeContext
            });
        }
        var routeContext = new RouteContext_1.RouteContext(url, route);
        // create new instance of the component
        var factory = resolver.resolveComponentFactory(componentType);
        var bindings = core_1.ReflectiveInjector.resolve([
            { provide: RouteContext_1.RouteContext, useValue: routeContext }
        ]);
        var inj = core_1.ReflectiveInjector.fromResolvedProviders(bindings, injector);
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
                    var delay$ = delay_1.delay.call(of_1.of(true), _this.prerenderFallback);
                    merge_1.merge.call(fromPromise_1.fromPromise(routeReady_1), delay$)
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
RouterExOutletComponent.decorators = [
    { type: core_1.Component, args: [{
                selector: "router-ex-outlet",
                styles: [":host { display: none;}"],
                template: "<div #placeholder></div>"
            },] },
];
/** @nocollapse */
RouterExOutletComponent.ctorParameters = function () { return [
    { type: RouterOutletMap_1.RouterOutletMap, },
    { type: core_1.ViewContainerRef, },
    { type: RouteReuseCache_1.RouteReuseCache, },
    { type: RouterScrollWrapper_1.RouterScrollWrapper, },
    { type: undefined, decorators: [{ type: core_1.Attribute, args: ["name",] },] },
]; };
RouterExOutletComponent.propDecorators = {
    'autoScroll': [{ type: core_1.Input },],
    'prerenderFallback': [{ type: core_1.Input },],
    'activateEvents': [{ type: core_1.Output, args: ["onActivate",] },],
    'deactivateEvents': [{ type: core_1.Output, args: ["onDeactivate",] },],
    'prerenderReadyEvents': [{ type: core_1.Output, args: ["prerenderReady",] },],
    'prerenderContainer': [{ type: core_1.ViewChild, args: ["placeholder", { read: core_1.ViewContainerRef },] },],
};
exports.RouterExOutletComponent = RouterExOutletComponent;
