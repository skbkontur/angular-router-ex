import { Injector, NgModuleFactoryLoader, NgModuleRef } from "@angular/core";
export declare abstract class RouterModuleFactory {
    abstract getModule(moduleName: string, parentInjector: Injector): Promise<NgModuleRef<any>>;
}
export declare class DefaultRouterModuleFactory extends RouterModuleFactory {
    private loader;
    private loaded;
    constructor(loader: NgModuleFactoryLoader);
    getModule(moduleName: string, parentInjector: Injector): Promise<NgModuleRef<any>>;
}
