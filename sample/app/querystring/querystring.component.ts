import {Component, OnInit} from "@angular/core";
import {Title} from "./title";
import {RouteContext, Router} from "../../../src/";

@Component({
    selector: 'querystring',
    templateUrl: './querystring.component.html'
})
export class QuerystringComponent implements OnInit {


    jsonParams: string;


    constructor(private router: Router, private routeContext: RouteContext) {

        this.routeContext.queryParams.subscribe((params) => {
            this.jsonParams = JSON.stringify(params);
        });

    }

    public changeQueryString(doupdate: boolean) {
        if (!doupdate) {
            this.router.setQuery({
                sampleKey: "sampleValue",
                leprechaun: "patrick"
            });
        } else {
            this.router.updateQuery({
                awesome: "yes",
                superhero: "batman"
            });

        }
    }

    public navigateAndSetQuery() {
        this.router.navigateByUrl("/about?search=something", null, {"error": "syncException"});
        // this.router.setQuery({"error":"syncException"})
    }

    public ngOnInit() {

    }

    public nullQueryString() {
        this.router.updateQuery({
            sampleKey: null,
        });
    }

    public resetQueryString() {
        this.router.setQuery({
            bee: "boo",
            foo: "bar",
        });
    }

    public setArrayParam() {
        this.router.setQuery({
            sampleArray: ["1", "2", "300"],
        });
    }

    public setQueryStringReplaceState() {
        this.router.setQuery({
            history: "no",
        }, {replaceUrl: true});
    }

    public setQueryWithHash() {
        this.router.navigateByUrl("/querystring?search=quest#epic!")
    }

    public setQueryWithQuestions() {
        this.router.navigateByUrl("/querystring?search=что? где? когда?&r321=what?")
    }

    public setValuelessParam() {
        this.router.setQuery({
            ok: true,
        });
    }
}
