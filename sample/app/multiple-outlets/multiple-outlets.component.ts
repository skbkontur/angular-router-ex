import {ChangeDetectionStrategy, Component} from "@angular/core";
import {Title} from "./title";
import {XLargeDirective} from "./x-large";
import {disabledGuards, enableGuards} from "./Guards";

@Component({
    selector: 'multiple-outlets',
    template: '<br><br><br><a tid="multiple-outlets-another-outlet-link" [href]="\'/multiple-outlets/1\'">goto route in another outlet</a><p tid="multiple-outlets-default-outlet-content">Here is standart outlet content.</p>',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MultipleOutletsComponent {

    constructor() {
    }
}
