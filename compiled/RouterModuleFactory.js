"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var core_1 = require("@angular/core");
var RouterModuleFactory = (function () {
    function RouterModuleFactory() {
    }
    return RouterModuleFactory;
}());
exports.RouterModuleFactory = RouterModuleFactory;
var DefaultRouterModuleFactory = (function (_super) {
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
    return DefaultRouterModuleFactory;
}(RouterModuleFactory));
DefaultRouterModuleFactory.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
DefaultRouterModuleFactory.ctorParameters = function () { return [
    { type: core_1.NgModuleFactoryLoader, },
]; };
exports.DefaultRouterModuleFactory = DefaultRouterModuleFactory;
