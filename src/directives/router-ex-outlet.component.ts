import {
    Attribute,
    Component,
    ComponentFactoryResolver,
    ComponentRef,
    EventEmitter,
    Injector,
    Input,
    OnDestroy,
    Output,
    Type,
    ViewChild,
    ViewContainerRef
} from "@angular/core";
import {RouteContext} from "../RouteContext";
import {IOutletActivationResult, IRouterOutlet, RouterOutletMap} from "../RouterOutletMap";
import {of} from "rxjs";
import {IPrerenderRouterComponent, ResolvedRoute, ReuseRouteStrategy} from "../Config";
import {RouteReuseCache} from "../RouteReuseCache";
import {RouterScrollWrapper} from "../RouterScrollWrapper";
import {Route} from "../";
import {delay, merge} from "rxjs/operators";
import {from} from "rxjs";

@Component({
    selector: "router-ex-outlet",
    styles: [`:host {
        display: none;
    }`],
    template: `
        <div #placeholder></div>`
})
export class RouterExOutletComponent implements OnDestroy, IRouterOutlet {

    @Input() autoScroll: boolean;
    @Input() prerenderFallback: number = 500;

    @Output("onActivate") activateEvents = new EventEmitter<any>();
    @Output("onDeactivate") deactivateEvents = new EventEmitter<any>();
    @Output("prerenderReady") prerenderReadyEvents = new EventEmitter<any>();

    @ViewChild("placeholder", {read: ViewContainerRef})
    prerenderContainer: ViewContainerRef;

    private activated: ComponentRef<any>;
    private routeCtx: RouteContext;

    constructor(private parentOutletMap: RouterOutletMap,
                private location: ViewContainerRef,
                private reuseCache: RouteReuseCache,
                private scrollWrapper: RouterScrollWrapper,
                @Attribute("name") private name: string) {

        parentOutletMap.register(<any>this, name);

    }

    get isActivated(): boolean {
        return !!this.activated;
    }

    get activatedComponent(): ComponentRef<any> {
        return this.activated;
    }

    activate(route: ResolvedRoute, url: string, componentType: Type<any>,
             resolver: ComponentFactoryResolver,
             injector: Injector,
             force?: boolean): Promise<IOutletActivationResult> {

        if (!force && this.routeCtx && routeEquals(this.routeCtx.route, route.route)) {
            this.routeCtx.update(url, route);
            return Promise.resolve({routeContext: this.routeCtx});
        }

        const cache = this.reuseCache.getForCurrentPage(componentType);

        if (cache) {
            // reuse existing component ref
            this.activateComponent(cache.ref, cache.routeContext);
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

        const routeContext = new RouteContext(url, route);
        // create new instance of the component
        const factory = resolver.resolveComponentFactory(componentType);
        const inj = Injector.create([
            {provide: RouteContext, useValue: routeContext}
        ], injector);
        //const inj = bindings.get(RouteContext)//= ReflectiveInjector.fromResolvedProviders(bindings, injector);
        let componentToActivate = this.prerenderContainer.createComponent(factory, this.prerenderContainer.length, inj, []);

        const onDone = () => {
            if (this.autoScroll) {
                this.scrollWrapper.moveTop();
            }
        };

        const noPrerender = () => {
            // no prerender
            this.prerenderContainer.detach();
            this.activateComponent(componentToActivate, routeContext);

            onDone();
            return Promise.resolve({
                routeContext
            });
        };

        // need to prerender component ?
        const prerenderComponent = componentToActivate.instance as IPrerenderRouterComponent;
        if (prerenderComponent.routePrerender) {
            let rendered = false;
            const routeReady = (componentToActivate.instance as IPrerenderRouterComponent)
                .routePrerender()
                .then(() => {
                    this.prerenderReadyEvents.emit(componentToActivate);
                }, (err) => {
                    this.prerenderReadyEvents.emit(componentToActivate);
                    throw err;
                });

            if (this.activatedComponent) {
                return new Promise(resolve => {

                    const delay$ = of(true)
                        .pipe(
                            delay(prerenderComponent.fallbackTimeout || this.prerenderFallback)
                        );


                    from(routeReady)
                        .pipe(
                            merge(delay$)
                        )
                        .subscribe(() => {
                            if (rendered) {
                                return;
                            }
                            rendered = true;
                            this.prerenderContainer.detach();
                            this.activateComponent(componentToActivate, routeContext);

                            onDone();
                            resolve({routeContext})
                        });

                });
            } else {
                return noPrerender();
            }

        } else {
            return noPrerender();
        }

    }

    ngOnDestroy() {
        this.parentOutletMap.unregister(this.name);
    }

    /**
     * Replace current activated component with specified one
     */
    private activateComponent(ref: ComponentRef<any>, routeCtx: RouteContext) {
        this.deactivateCurrent();
        this.attach(ref, routeCtx);
        this.activateEvents.emit(this.activated.instance);
        if (ref.instance.onRouteOutletActivated) {
            ref.instance.onRouteOutletActivated();
        }
    }

    private attach(ref: ComponentRef<any>, routeContext: RouteContext) {
        this.activated = ref;
        this.routeCtx = routeContext;
        this.location.insert(ref.hostView);
    }

    private deactivateCurrent() {
        if (this.activated) {
            const c = this.activated.instance;
            const cache = this.reuseCache.getCacheFor(this.activated);

            if (this.activated.instance.onRouteOutletDeactivated) {
                this.activated.instance.onRouteOutletDeactivated();
            }

            if (cache) {
                this.location.detach();
                cache.detached();
            } else {
                this.activated.destroy();
            }

            this.activated = null;
            this.deactivateEvents.emit(c);
        }
    }

}

function routeEquals(route: Route, route2: Route): boolean {
    return route.path === route2.path;
}
