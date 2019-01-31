import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SigninRoutingModule } from "./signin-routing.module";
import { SigninComponent } from "./signin.component";

const MODULES = [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule
]

const COMPONENTS = [
    SigninComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class SigninModule { }
