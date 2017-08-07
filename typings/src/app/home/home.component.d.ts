import { OnInit } from "@angular/core";
import { AppState } from "../app.service";
import { Router } from "../../../router-ex/";
export declare class HomeComponent implements OnInit {
    appState: AppState;
    private router;
    localState: {
        value: string;
    };
    constructor(appState: AppState, router: Router);
    enable(): void;
    disable(): void;
    navigateToAbout(replace: boolean): void;
    ngOnInit(): void;
    submitState(value: string): void;
}
