import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from "@angular/material/input";
import { SigninRoutingModule } from "./signin-routing.module";
import { SigninComponent } from "./signin.component";

const MODULES = [
    CommonModule,
    SigninRoutingModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule
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
