import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { AuthorizationComponent } from "./authorization.component";

const MODULES = [
    CommonModule,
    AuthorizationRoutingModule,
    ReactiveFormsModule
]

const COMPONENTS = [
    AuthorizationComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class AuthorizationModule { }
