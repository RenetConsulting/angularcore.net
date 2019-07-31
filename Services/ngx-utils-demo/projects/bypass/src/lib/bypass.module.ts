import { NgModule } from '@angular/core';
import { BypassPipe } from './bypass.pipe';

@NgModule({
    declarations: [BypassPipe],
    exports: [BypassPipe],
})
export class BypassModule { }
