"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Config_1 = require("../Config");
var core_1 = require("@angular/core");
function createAsyncMatcher(loader, parentInjector, compiler, resolve) {
    return function (url, route) {
        if (!route.loadModule) {
            throw new Error("not an async route");
        }
        if (route.loadModuleCondition && !route.loadModuleCondition(url)) {
            return Promise.resolve(null); // don't need to load child module for specified url
        }
        if (typeof route.loadModule === "string") {
            return loader.getModule(route.loadModule, parentInjector).then(function (ref) {
                return resolve(ref.injector.get(Config_1.ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
            });
        }
        else {
            var offlineMode_1 = compiler instanceof core_1.Compiler;
            var loadModule = route.loadModule;
            return loadModule()
                .then(function (module) {
                return offlineMode_1 ? module : compiler.compileModuleAsync(module);
            })
                .then(function (factory) {
                var ref = factory.create(parentInjector);
                return resolve(ref.injector.get(Config_1.ROUTE_CONFIG), ref.injector, ref.componentFactoryResolver);
            });
        }
    };
}
exports.createAsyncMatcher = createAsyncMatcher;
