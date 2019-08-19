import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TitleStrategyComponent } from './title-strategy.component';

@NgModule({
    declarations: [TitleStrategyComponent],
    exports: [TitleStrategyComponent],
    imports: [
        RouterModule
    ]
})
export class TitleStrategyModule { }
