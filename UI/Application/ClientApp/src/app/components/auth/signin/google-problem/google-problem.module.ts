import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { GoogleProblemRoutingModule } from './google-problem-routing.module';
import { GoogleProblemComponent } from './google-problem.component';

@NgModule({
    declarations: [GoogleProblemComponent],
    imports: [
        CommonModule,
        GoogleProblemRoutingModule,
        MatCardModule
    ]
})
export class GoogleProblemModule { }
