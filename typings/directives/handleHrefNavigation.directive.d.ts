import { OnDestroy, OnInit } from "@angular/core";
import { Router } from "../Router";
/**
 * Intercept all document click on anchor href and perform router navigation
 */
export declare class HandleHrefNavigationDirective implements OnDestroy, OnInit {
    private router;
    private handler;
    constructor(router: Router);
    ngOnInit(): void;
    ngOnDestroy(): void;
    private static isExternalNavigation(url);
}
