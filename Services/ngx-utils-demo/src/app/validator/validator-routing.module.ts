import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidatorComponent } from './validator.component';

const routes: Routes = [
    { path: '', component: ValidatorComponent }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ValidatorRoutingModule { }
