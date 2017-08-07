import { OnInit } from '@angular/core';
import { RouteOutletActivated, RouteOutletDeactivated } from "../../../router-ex/";
import { HeaderMessageService } from "../header-message.service";
export declare class AboutComponent implements OnInit, RouteOutletActivated, RouteOutletDeactivated {
    private msgSvc;
    localState: any;
    location: Location;
    activatedMessage: string;
    constructor(msgSvc: HeaderMessageService);
    ngOnInit(): void;
    onRouteOutletActivated(): void;
    onRouteOutletDeactivated(): void;
}
