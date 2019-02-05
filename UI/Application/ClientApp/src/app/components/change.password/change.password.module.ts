import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { ControlInputModule } from "../control.input/control.input.module";
import { ChangePasswordRoutingModule } from "./change.password-routing.module";
import { ChangePasswordComponent } from "./change.password.component";

const MODULES = [
    CommonModule,
    ChangePasswordRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    ControlInputModule
]

const COMPONENTS = [
    ChangePasswordComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class ChangePasswordModule { }
