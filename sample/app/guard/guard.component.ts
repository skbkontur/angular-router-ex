import {
  Component,
  OnInit
} from '@angular/core';

import {Title} from './title';
import {XLargeDirective} from './x-large';
import {disabledGuards, enableGuards} from "./Guards";

@Component({
  selector: 'guard',
  template: `<h1 tid="page-title">Guard page</h1>
                <p>
                    <button tid="enable-guards" (click)="enable()">enable guards</button>
                    <button tid="disable-guards" (click)="disable()">disable guards</button>
              </p>`
})
export class GuardComponent implements OnInit {

  ngOnInit(): void {
  }

  enable() {
    enableGuards();
  }

  disable() {
    disabledGuards();
  }


}
