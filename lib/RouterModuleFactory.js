import * as tslib_1 from "tslib";
import { Injectable, NgModuleFactoryLoader } from "@angular/core";
var RouterModuleFactory = /** @class */ (function () {
    function RouterModuleFactory() {
    }
    return RouterModuleFactory;
}());
export { RouterModuleFactory };
var DefaultRouterModuleFactory = /** @class */ (function (_super) {
    tslib_1.__extends(DefaultRouterModuleFactory, _super);
    function DefaultRouterModuleFactory(loader) {
        var _this = _super.call(this) || this;
        _this.loader = loader;
        _this.loaded = {};
        return _this;
    }
    DefaultRouterModuleFactory.prototype.getModule = function (moduleName, parentInjector) {
        var _this = this;
        if (this.loaded[moduleName]) {
            return Promise.resolve(this.loaded[moduleName]);
        }
        return this.loader.load(moduleName).then(function (factory) {
            return _this.loaded[moduleName] = factory.create(parentInjector);
        });
    };
    DefaultRouterModuleFactory.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    DefaultRouterModuleFactory.ctorParameters = function () { return [
        { type: NgModuleFactoryLoader, },
    ]; };
    return DefaultRouterModuleFactory;
}(RouterModuleFactory));
export { DefaultRouterModuleFactory };
