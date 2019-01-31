import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { SignupRoutingModule } from "./signup-routing.module";
import { SignupComponent } from "./signup.component";

const MODULES = [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule
]

const COMPONENTS = [
    SignupComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class SignupModule { }
