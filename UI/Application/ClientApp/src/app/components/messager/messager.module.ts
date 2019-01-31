import { CommonModule } from "@angular/common";
import { NgModule, Provider } from "@angular/core";
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from "@angular/material/snack-bar";
import { SNACK_BAR_MESSAGER_OPTIONS } from "../../consts/snack.bar.messager.options";
import { MessagerComponent } from "./messager.component";

const MODULES = [
    CommonModule,
    MatSnackBarModule
]

const PROVIDERS: Array<Provider> = [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: SNACK_BAR_MESSAGER_OPTIONS}
]

const COMPONENTS = [
    MessagerComponent
]

@NgModule({
    imports: [
        ...MODULES
    ],   
    exports: [
        ...COMPONENTS
    ],
    declarations: [
        ...COMPONENTS
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class MessagerModule { }
