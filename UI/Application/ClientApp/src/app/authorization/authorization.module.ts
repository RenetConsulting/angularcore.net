import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { AuthorizationComponent } from "./authorization.component";

const COMPONENTS = [
    AuthorizationComponent
]

const MODULES = [
    CommonModule,
    AuthorizationRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
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
