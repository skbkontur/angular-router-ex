import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from "../../../src/";
import {HeaderMessageService} from "../header-message.service";
import {Observable, Subject} from "rxjs";

@Component({
    selector: 'not-in-outlet',
    template: `<p style="min-height:30px;" tid="not-in-outlet-text">{{paramText}}</p><p tid="header-message">
        {{msg$ | async}}</p>
    <p tid="url-replace-message">
        {{urlReplaceMsg$ | async}}</p>`
})
export class NotInOutletComponent implements OnInit {

    paramText: string;

    msg$: Observable<string>;
    urlReplaceMsg$ = new Subject<string>();

    constructor(
        public router: Router,
        msgSvc: HeaderMessageService
    ) {
        this.msg$ = msgSvc.getMessage();
    }

    public ngOnInit() {
        this.router.queryParams.subscribe((p) => {
            this.paramText = p["sampleKey"] as string;
        });

        this.router.events.subscribe(e => {
           if(e instanceof NavigationEnd){
               if(e.historyReplaced){
                   this.urlReplaceMsg$.next("old url replaced");
               } else {
                   this.urlReplaceMsg$.next("new url");
               }
           }
        })

    }

}
