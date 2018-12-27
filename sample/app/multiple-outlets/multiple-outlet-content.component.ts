import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";
import {RouteContext} from "../../../src/";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";

@Component({
    selector: 'multiple-outlet-content',
    template: '<p tid="multiple-outlets-another-outlet-content">another outlet content</p><a tid="multiple-outlets-another-outlet-next-link" [href]="nextHref$|async">goto_third route in this outlet</a>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleOutletContentComponent {

    nextHref$: Observable<string>;

    constructor(private routeContext: RouteContext) {

    }

    ngOnInit() {
        this.nextHref$ = this.routeContext.routeParams.pipe(map(params => `multiple-outlets/${parseInt(params["id"]) + 1}`));
    }
}
