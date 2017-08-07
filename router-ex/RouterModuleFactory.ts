import {Injectable, Injector, NgModuleFactoryLoader, NgModuleRef} from "@angular/core";

export abstract class RouterModuleFactory {

    abstract getModule(moduleName: string, parentInjector: Injector): Promise<NgModuleRef<any>>;

}

@Injectable()
export class DefaultRouterModuleFactory extends RouterModuleFactory {

    private loaded: { [moduleName: string]: NgModuleRef<any> } = {};

    constructor(private loader: NgModuleFactoryLoader) {
        super();
    }

    getModule(moduleName: string, parentInjector: Injector): Promise<NgModuleRef<any>> {
        if (this.loaded[moduleName]) {
            return Promise.resolve(this.loaded[moduleName]);
        }

        return this.loader.load(moduleName).then(factory => {
            return this.loaded[moduleName] = factory.create(parentInjector);
        });
    }

}
