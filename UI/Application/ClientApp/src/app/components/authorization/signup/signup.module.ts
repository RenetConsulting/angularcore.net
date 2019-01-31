import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { ValidatorModule } from "../../../directives/validator/validator.module";
import { SignupRoutingModule } from "./signup-routing.module";
import { SignupComponent } from "./signup.component";

const MODULES = [
    CommonModule,
    SignupRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    ValidatorModule
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
