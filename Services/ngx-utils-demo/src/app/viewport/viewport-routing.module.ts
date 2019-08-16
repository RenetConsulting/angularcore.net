import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewportComponent } from './viewport.component';

const routes: Routes = [{ path: '', component: ViewportComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewportRoutingModule { }
