import {
  Component,
  OnInit,
} from '@angular/core';
import {RouteContext} from "../../../src/";



@Component({
  selector: 'detail-extra',
  template: `
    <h1 tid="page-title">Detail extra page</h1>
    <p>
      nested lazy loaded component
    </p>
    <p tid="detail-extra-param">
    Current extra param : {{param}}
    </p>
    <p><a href="/detail/extra/1">goto 1</a></p>
    <p><a href="/detail/extra/2">goto 2</a></p>
    <p><a href="/detail/extra/3">goto 3</a></p>
  `,
})
export class DetailExtraComponent {

  param: string;

  constructor(private routeCtx:RouteContext){
      this.routeCtx.routeParams.subscribe(p=>{
        this.param = p["id"];
      })
  }

}
