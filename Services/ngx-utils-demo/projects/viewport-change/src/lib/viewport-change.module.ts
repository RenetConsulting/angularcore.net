import { NgModule } from '@angular/core';
import { ViewportChangeDirective } from './viewport-change.directive';

@NgModule({
    declarations: [ViewportChangeDirective],
    exports: [ViewportChangeDirective]
})
export class ViewportChangeModule { }
