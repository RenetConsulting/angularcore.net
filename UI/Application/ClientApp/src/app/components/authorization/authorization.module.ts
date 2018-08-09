import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AuthorizationService } from "../../services/authorization/authorization.service";
import { HttpHandlerService } from "../../services/http.handler/http.handler.service";
import { LocalStorageService } from "../../services/local.storage/local.storage.service";
import { TokenService } from "../../services/token/token.service";
import { ToolsService } from "../../services/tools/tools.service";
import { AuthorizationRoutingModule } from "./authorization-routing.module";
import { AuthorizationComponent } from "./authorization.component";

const MODULES = [
    CommonModule,
    AuthorizationRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
]

const PROVIDERS = [
    AuthorizationService,
    HttpHandlerService,
    LocalStorageService,
    TokenService,
    ToolsService
]

const COMPONENTS = [
    AuthorizationComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],
    providers: [
        ...PROVIDERS
    ],
    declarations: [
        ...COMPONENTS
    ]
})
export class AuthorizationModule { }
