/*
 * Angular 2 decorators and services
 */
import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {AppState} from "./app.service";

/*
 * App Component
 * Top Level Component
 */
@Component({
  selector: 'app',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    './app.component.css'
  ],
  template: `<nav handleHrefNavigation>
      <a tid="navigate-page-guard" [href]="'/guard'">
        Guard
      </a>
      <a  tid="navigate-page-home"[href]="'/home'">
        Home
      </a>
      <a tid="navigate-page-detail" [href]="'/detail'">
        Detail
      </a>

      <a tid="navigate-page-about" [href]="'/about'">
        About
      </a>
      <a tid="navigate-page-item"[href]="'/item/1'">
        Item 1
      </a>
      <a tid="navigate-page-sticky" [href]="'/sticky/1'">
        Sticky
      </a>
      <a tid="navigate-page-cacheback" [href]="'/cacheback/1'">
        Cache back
      </a>
      <a tid="navigate-page-querystring" [href]="'/querystring'">
        Query String
      </a>
      <a tid="navigate-page-prerender" [href]="'/prerender'">
        Prerender
      </a>
      <a tid="navigate-page-404" [href]="'/404NonExistentPage'" class="warn">
        404
      </a>
      <a tid="navigate-page-error" [href]="'/error-page'" class="warn">
          Error
      </a>
    </nav>
    
    <not-in-outlet></not-in-outlet>

    <main>
      <router-ex-outlet [autoScroll]="true"></router-ex-outlet>
    </main>

  `
})
export class AppComponent implements OnInit {
  public angularclassLogo = 'assets/img/angularclass-avatar.png';
  public name = 'Angular 2 Webpack Starter';
  public url = 'https://twitter.com/AngularClass';

  constructor(public appState: AppState) {
  }

  public ngOnInit() {
    console.log('Initial App State', this.appState.state);
  }

}

/*
 * Please review the https://github.com/AngularClass/angular2-examples/ repo for
 * more angular app examples that you may copy/paste
 * (The examples may not be updated as quickly. Please open an issue on github for us to update it)
 * For help or questions please contact us at @AngularClass on twitter
 * or our chat on Slack at https://AngularClass.com/slack-join
 */
