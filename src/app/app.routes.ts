import {HomeComponent} from "./home";
import {AboutComponent} from "./about";
import {Routes} from "../../router-ex/";
import {GuardComponent} from "./guard/guard.component";
import {GuardOnActivate, GuardOnDeactivate} from "./guard/Guards";
import {ItemComponent} from "./item/item.component";
import {StickyComponent} from "./sticky/sticky.component";
import {CacheBackComponent} from "./cacheback/cache-back.component";
import {NoContentComponent} from "./no-content";
import {QuerystringComponent} from "./querystring/querystring.component";
import {PrerenderComponent} from "./prerender/prerender.component";
import {ErrorNavigationComponent} from "./error-navigation/error-navigation.component";

export const ROUTES: Routes = [
    {path: "", component: HomeComponent},
    {path: "/home", component: HomeComponent},
    {path: "/about", component: AboutComponent},
    {path: "/guard", component: GuardComponent, canActivate: [GuardOnActivate], canDeactivate: [GuardOnDeactivate]},
    {path: "/item/:id", component: ItemComponent},
    {path: "/sticky/:id", component: StickyComponent},
    {path: "querystring", component: QuerystringComponent},
    {path: "/cacheback/:id", component: CacheBackComponent},
    {path: "/prerender", component: PrerenderComponent},
    {
        path: "/detail", loadModule: () => {
        return new Promise(resolve => {
            require.ensure([], () => {
                resolve(require("./+detail/detail.module")["DetailModule"]);
            }, "detail");
        })
    },
        loadModuleCondition: url => (url.indexOf("/detail") === 0),
    },
    {
        loadModuleCondition: url => (url.indexOf("/error-page") === 0),
        loadModule: () => {
            return Promise.reject("test error");
        }
    },
    {path: "**", component: NoContentComponent},
    {path: "##", component: ErrorNavigationComponent},
];
