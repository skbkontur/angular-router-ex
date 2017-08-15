### Angular Router EX [![Build Status](https://travis-ci.org/skbkontur/angular-router-ex.svg?branch=master)](https://travis-ci.org/skbkontur/angular-router-ex)

Angular 2+  Router with custom route urls, route caching, route prerendering and more.

### Install

``` shell
npm i angular-router-ex --save
```

### Usage

Define some routes

``` typescript
export const ROUTES: Routes = [
    {path: "", component: HomeComponent},
    {path: "/home", component: HomeComponent},
    {path: "/about", component: AboutComponent},
    {path: "/item/:id", component: ItemComponent},
]
```

Import angular-router-ex with your routes in main application module
``` typescript
import {RouterExModule} from "angular-router-ex";

@NgModule({
    imports: [ 
        ...
        RouterExModule.forRoot(ROUTES)
    ],
})
export class AppModule {
...
}
```

Place router outlet in your root component template
``` html
<router-ex-outlet [autoScroll]="true"></router-ex-outlet>
```

[Visit wiki](https://github.com/skbkontur/angular-router-ex/wiki) for more documentation and examples.

### Demo Project

checkout repo and run 
``` shell
npm i && npm start
``` 

default server port is 3000

run tests (unit + e2e)
``` shell
npm run test
```
Demo project based on [Angular Webpack Starter](https://github.com/AngularClass/angular-starter) 
