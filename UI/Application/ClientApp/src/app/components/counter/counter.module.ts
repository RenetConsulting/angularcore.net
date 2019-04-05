import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { CounterRoutingModule } from './counter-routing.module';
import { CounterComponent } from './counter.component';

@NgModule({
    declarations: [CounterComponent],
    imports: [
        CommonModule,
        CounterRoutingModule,
        MatButtonModule
    ],
})
export class CounterModule { }
