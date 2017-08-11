import {
  Component,
  OnInit,
} from '@angular/core';
/*
 * We're loading this component asynchronously
 * We are using some magic with es6-promise-loader that will wrap the module with a Promise
 * see https://github.com/gdi2290/es6-promise-loader for more info
 */

console.log('`Detail` component loaded asynchronously');

@Component({
  selector: 'detail',
  template: `
    <h1 tid="page-title">Detail page</h1>
    <p>
      lazy loaded component
    </p>
    <p><a tid="extra-detail-link" href="/detail/extra/2">Extra detail</a></p>
  `,
})
export class DetailComponent {


}
