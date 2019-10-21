import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalComponent } from './external.component';


const routes: Routes = [{path: '', component: ExternalComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalRoutingModule { }
