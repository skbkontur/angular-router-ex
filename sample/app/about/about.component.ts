import {
  Component,
  OnInit
} from '@angular/core';
import {RouteOutletActivated, RouteOutletDeactivated} from "../../../src/";
import {HeaderMessageService} from "../header-message.service";

@Component({
  selector: 'about',
  template: `
    <h1 tid="page-title">About page</h1>
    
    <p>
      <a [href]="location.protocol + '//'+ location.hostname + (location.port ? ':'+location.port : '') + '/home'" tid="navigate-page-absurl">
      Absolute URL
      </a>
    </p>
  `
})
export class AboutComponent implements OnInit, RouteOutletActivated, RouteOutletDeactivated {

  public localState: any;

  location: Location = window.location;

  activatedMessage:string;

  constructor(
    private msgSvc: HeaderMessageService
  ) {}

  public ngOnInit() {

  }

  onRouteOutletActivated() {
        this.msgSvc.setMessage("about activated");
  }

  onRouteOutletDeactivated() {
        this.msgSvc.setMessage("about deactivated");
  }


}
