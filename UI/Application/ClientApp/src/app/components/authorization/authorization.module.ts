import { NgModule } from '@angular/core';
import { AuthorizationRoutingModule } from './authorization-routing.module';

const MODULES = [
    AuthorizationRoutingModule
];

@NgModule({
    imports: [
        ...MODULES
    ],
})
export class AuthorizationModule { }
