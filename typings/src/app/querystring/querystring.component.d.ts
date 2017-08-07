import { OnInit } from "@angular/core";
import { Router, RouteContext } from "../../../router-ex/";
export declare class QuerystringComponent implements OnInit {
    private router;
    private routeContext;
    jsonParams: string;
    constructor(router: Router, routeContext: RouteContext);
    ngOnInit(): void;
    changeQueryString(doupdate: boolean): void;
    resetQueryString(): void;
    setArrayParam(): void;
    setValuelessParam(): void;
    setQueryStringReplaceState(): void;
    nullQueryString(): void;
    navigateAndSetQuery(): void;
    setQueryWithQuestions(): void;
}
