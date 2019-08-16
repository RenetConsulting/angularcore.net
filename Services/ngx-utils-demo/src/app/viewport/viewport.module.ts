import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ViewportRoutingModule } from './viewport-routing.module';
import { ViewportComponent } from './viewport.component';
import { ViewportChangeModule } from 'projects/viewport-change/src/public-api';

@NgModule({
  declarations: [ViewportComponent],
  imports: [
    CommonModule,
    ViewportRoutingModule,
    ScrollingModule,
    ViewportChangeModule
  ]
})
export class ViewportModule { }
