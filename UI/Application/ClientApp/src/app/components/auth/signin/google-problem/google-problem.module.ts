import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { GoogleProblemRoutingModule } from './google-problem-routing.module';
import { GoogleProblemComponent } from './google-problem.component';

@NgModule({
    declarations: [GoogleProblemComponent],
    imports: [
        CommonModule,
        GoogleProblemRoutingModule
    ]
})
export class GoogleProblemModule { }
