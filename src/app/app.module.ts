import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {ApplicationRef, NgModule} from "@angular/core";
import {createInputTransfer, createNewHosts, removeNgStyles} from "@angularclass/hmr";
/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from "./environment";
import {ROUTES} from "./app.routes";
// App is our top level component
import {AppComponent} from "./app.component";
import {AppState, InternalStateType} from "./app.service";
import {HomeComponent} from "./home";
import {AboutComponent} from "./about";
import {NoContentComponent} from "./no-content";
import {XLargeDirective} from "./home/x-large";
import "../styles/styles.css";
import "../styles/headings.css";
import {RouterExModule} from "../../router-ex/";
import {CommonModule} from "@angular/common";
import {GuardComponent} from "./guard/guard.component";
import {GuardOnActivate, GuardOnDeactivate} from "./guard/Guards";
import {ItemComponent} from "./item/item.component";
import {StickyComponent} from "./sticky/sticky.component";
import {CacheBackComponent} from "./cacheback/cache-back.component";
import {QuerystringComponent} from "./querystring/querystring.component";
import {NotInOutletComponent} from "./not-in-outlet/not-in-outlet.component";
import {PrerenderComponent} from "./prerender/prerender.component";
import {ErrorNavigationComponent} from "./error-navigation/error-navigation.component";
import {HeaderMessageService} from "./header-message.service";
import {QueryStringParser} from "../../router-ex/QueryStringParser";

// Application wide providers
const APP_PROVIDERS = [
    AppState,
    GuardOnActivate,
    GuardOnDeactivate,
    QueryStringParser,
    HeaderMessageService
];

type StoreType = {
    state: InternalStateType,
    restoreInputValues: () => void,
    disposeOldHosts: () => void
};

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
    bootstrap: [AppComponent],
    declarations: [
        AppComponent,
        AboutComponent,
        HomeComponent,
        GuardComponent,
        ItemComponent,
        NoContentComponent,
        StickyComponent,
        CacheBackComponent,
        QuerystringComponent,
        NotInOutletComponent,
        PrerenderComponent,
        ErrorNavigationComponent
    ],
    imports: [ // import Angular's modules
        BrowserModule,
        CommonModule,
        FormsModule,
        HttpModule,
        RouterExModule.forRoot(ROUTES)
    ],
    providers: [ // expose our Services and Providers into Angular's dependency injection
        ENV_PROVIDERS,
        APP_PROVIDERS
    ]
})
export class AppModule {

    constructor(public appRef: ApplicationRef,
                public appState: AppState) {
    }

    public hmrOnInit(store: StoreType) {
        if (!store || !store.state) {
            return;
        }
        console.log('HMR store', JSON.stringify(store, null, 2));
        // set state
        this.appState._state = store.state;
        // set input values
        if ('restoreInputValues' in store) {
            let restoreInputValues = store.restoreInputValues;
            setTimeout(restoreInputValues);
        }

        this.appRef.tick();
        delete store.state;
        delete store.restoreInputValues;
    }

    public hmrOnDestroy(store: StoreType) {
        const cmpLocation = this.appRef.components.map((cmp) => cmp.location.nativeElement);
        // save state
        const state = this.appState._state;
        store.state = state;
        // recreate root elements
        store.disposeOldHosts = createNewHosts(cmpLocation);
        // save input values
        store.restoreInputValues = createInputTransfer();
        // remove styles
        removeNgStyles();
    }

    public hmrAfterDestroy(store: StoreType) {
        // display new elements
        store.disposeOldHosts();
        delete store.disposeOldHosts;
    }

}
