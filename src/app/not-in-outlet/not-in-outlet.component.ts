import {
  Component,
  OnInit
} from '@angular/core';
import {Router} from "../../../router-ex/";
import {HeaderMessageService} from "../header-message.service";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'not-in-outlet',
  template: `<p style="min-height:30px;" tid="not-in-outlet-text">{{paramText}}</p><p tid="header-message">{{msg$ | async}}</p>`
})
export class NotInOutletComponent implements OnInit {

  paramText:string;

  msg$:Observable<string>;

  constructor(
    public router: Router,
    msgSvc:HeaderMessageService
  ) {
      this.msg$ =  msgSvc.getMessage();
  }

  public ngOnInit() {
    this.router.queryParams.subscribe((p)=>{
      this.paramText = p["sampleKey"] as string;
    })

  }

}
