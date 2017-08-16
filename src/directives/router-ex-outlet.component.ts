import {
    Attribute,
    ComponentFactoryResolver,
    ComponentRef,
    Component,
    EventEmitter,
    Injector,
    OnDestroy,
    Output,
    ReflectiveInjector,
    ViewContainerRef,
    ViewChild,
    Type,
    Input
} from "@angular/core";
import {RouteContext} from "../RouteContext";
import {RouterOutletMap, IRouterOutlet, IOutletActivationResult} from "../RouterOutletMap";
import {fromPromise} from "rxjs/observable/fromPromise";
import {of} from "rxjs/observable/of";
import {delay} from "rxjs/operator/delay";
import {merge} from "rxjs/operator/merge";
import {IPrerenderRouterComponent, ResolvedRoute, ReuseRouteStrategy} from "../Config";
import {RouteReuseCache} from "../RouteReuseCache";
import {RouterScrollWrapper} from "../RouterScrollWrapper";


@Component({
    selector: "router-ex-outlet",
    styles: [`:host { display: none;}`],
    template: `<div #placeholder></div>`
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

    ngOnDestroy() {
        this.parentOutletMap.unregister(this.name);
    }

    get isActivated(): boolean {
        return !!this.activated;
    }

    get activatedComponent(): ComponentRef<any> {
        return this.activated;
    }

    activate(route: ResolvedRoute, url: string, componentType: Type<any>, resolver: ComponentFactoryResolver, injector: Injector): Promise<IOutletActivationResult> {

        const cache = this.reuseCache.getForCurrentPage(componentType);

        if (cache) {
            // reuse existing component ref
            this.activateComponent(cache.ref);
            cache.attached();

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
        const bindings = ReflectiveInjector.resolve([
            {provide: RouteContext, useValue: routeContext}
        ]);
        const inj = ReflectiveInjector.fromResolvedProviders(bindings, injector);
        let componentToActivate = this.prerenderContainer.createComponent(factory, this.prerenderContainer.length, inj, []);
        this.prerenderContainer.detach();

        const onDone = () => {
            // componentToActivate.changeDetectorRef.detectChanges();
            if (this.autoScroll) {
                this.scrollWrapper.moveTop();
            }
        };

        const noPrerender = () => {
            // no prerender
            this.activateComponent(componentToActivate);

            onDone();
            return Promise.resolve({
                routeContext
            });
        };

        // need to prerender component ?
        if ((componentToActivate.instance as IPrerenderRouterComponent).routePrerender) {
            let rendered = false;
            componentToActivate.changeDetectorRef.detectChanges();

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
                    const delay$ = delay.call(of(true), this.prerenderFallback);
                    merge.call(fromPromise(routeReady), delay$)
                        .subscribe(() => {
                            if (rendered) {
                                return;
                            }
                            rendered = true;
                            this.prerenderContainer.detach();
                            this.activateComponent(componentToActivate);

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

    /**
     * Replace current activated component with specified one
     */
    private activateComponent(ref: ComponentRef<any>) {
        this.deactivateCurrent();
        this.attach(ref, null);
        this.activateEvents.emit(this.activated.instance);
        if (ref.instance.onRouteOutletActivated) {
            ref.instance.onRouteOutletActivated();
        }
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

    private attach(ref: ComponentRef<any>, routeContext: RouteContext) {
        this.activated = ref;
        this.routeCtx = routeContext;
        this.location.insert(ref.hostView);
    }

}
