import { NgModule } from '@angular/core';
import { NgxDropDirective } from './ngx-drop.directive';
import { NgxSelectDirective } from './ngx-select.directive';

@NgModule({
    declarations: [NgxDropDirective, NgxSelectDirective],
    exports: [NgxDropDirective, NgxSelectDirective],
})
export class NgxUploaderModule { }
