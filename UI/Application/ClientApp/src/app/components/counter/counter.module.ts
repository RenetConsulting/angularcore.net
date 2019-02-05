import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CounterRoutingModule } from './counter-routing.module';
import { CounterComponent } from './counter.component';

@NgModule({
  imports: [
    CommonModule,
    CounterRoutingModule
  ],
  declarations: [
    CounterComponent
  ]
})
export class CounterModule { }
