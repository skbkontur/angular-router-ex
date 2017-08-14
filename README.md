### Angular Router EX

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

Import angular-router-ex with your routs in main application module
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