import { ROUTE_CONFIG } from "../Config";
import { Compiler } from "@angular/core";
export function createAsyncMatcher(loader, parentInjector, compiler, resolve) {
    return function (url, route) {
        if (!route.loadModule) {
            throw new Error("not an async route");
        }
        if (route.loadModuleCondition && !route.loadModuleCondition(url)) {
            return Promise.resolve(null); // don't need to load child module for specified url
        }
        if (typeof route.loadModule === "string") {
            return loader.getModule(route.loadModule, parentInjector).then(function (ref) {
                return resolve(ref.injector.get(ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
            });
        }
        else {
            var offlineMode_1 = compiler instanceof Compiler;
            var loadModule = route.loadModule;
            return loadModule()
                .then(function (module) {
                return offlineMode_1 ? module : compiler.compileModuleAsync(module);
            })
                .then(function (factory) {
                var ref = factory.create(parentInjector);
                return resolve(ref.injector.get(ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
            });
        }
    };
}
