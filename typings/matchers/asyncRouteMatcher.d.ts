import { RouteMatcher, Routes } from "../Config";
import { RouterModuleFactory } from "../RouterModuleFactory";
import { Injector, Compiler, ComponentFactoryResolver } from "@angular/core";
export declare type LoadedModuleRoutesResolver = (routes: Routes, injector: Injector, resolver: ComponentFactoryResolver) => Promise<any>;
export declare function createAsyncMatcher(loader: RouterModuleFactory, parentInjector: Injector, compiler: Compiler, resolve: LoadedModuleRoutesResolver): RouteMatcher;
