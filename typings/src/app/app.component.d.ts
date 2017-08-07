import { OnInit } from "@angular/core";
import { AppState } from "./app.service";
export declare class AppComponent implements OnInit {
    appState: AppState;
    angularclassLogo: string;
    name: string;
    url: string;
    constructor(appState: AppState);
    ngOnInit(): void;
}
