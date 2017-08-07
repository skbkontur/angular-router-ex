import {RouteMatcher, Route, Routes, LoadModuleCallback, ROUTE_CONFIG} from "../Config";
import {RouterModuleFactory} from "../RouterModuleFactory";
import {Injector, Compiler, ComponentFactoryResolver} from "@angular/core";

export type LoadedModuleRoutesResolver = (routes: Routes, injector: Injector, resolver: ComponentFactoryResolver) => Promise<any>;

export function createAsyncMatcher(loader: RouterModuleFactory,
                                   parentInjector: Injector,
                                   compiler: Compiler,
                                   resolve: LoadedModuleRoutesResolver): RouteMatcher {

    return (url: string, route: Route): Promise<any> => {
        if (!route.loadModule) {
            throw new Error("not an async route");
        }

        if (route.loadModuleCondition && !route.loadModuleCondition(url)) {
            return Promise.resolve(null); // don't need to load child module for specified url
        }

        if (typeof route.loadModule === "string") {
            return loader.getModule(route.loadModule as string, parentInjector).then(ref => {
                return resolve(ref.injector.get(ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
            });
        } else {
            const offlineMode = compiler instanceof Compiler;
            const loadModule = route.loadModule as LoadModuleCallback;
            return loadModule()
                .then(module => {
                    return offlineMode ? module : compiler.compileModuleAsync(<any>module);
                })
                .then((factory) => {
                    const ref = factory.create(parentInjector);
                    return resolve(ref.injector.get(ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
                });
        }


    }

}

