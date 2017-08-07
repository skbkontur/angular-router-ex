import { OnInit } from '@angular/core';
import { Router } from "../../../router-ex/";
import { HeaderMessageService } from "../header-message.service";
import { Observable } from "rxjs/Observable";
export declare class NotInOutletComponent implements OnInit {
    router: Router;
    paramText: string;
    msg$: Observable<string>;
    constructor(router: Router, msgSvc: HeaderMessageService);
    ngOnInit(): void;
}
