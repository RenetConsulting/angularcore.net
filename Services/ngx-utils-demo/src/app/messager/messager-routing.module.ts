import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MessagerComponent } from './messager.component';

const routes: Routes = [
    { path: '', component: MessagerComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MessagerRoutingModule { }
