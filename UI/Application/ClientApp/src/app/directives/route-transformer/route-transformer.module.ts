import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RouteTransformerDirective } from './route-transformer.directive';

@NgModule({
    declarations: [RouteTransformerDirective],
    exports: [RouteTransformerDirective],
    imports: [
        CommonModule,
        RouterModule,
    ]
})
export class RouteTransformerModule { }
