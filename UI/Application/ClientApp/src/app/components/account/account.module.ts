import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';

const MODULES = [
    AccountRoutingModule
];

@NgModule({
    imports: [
        ...MODULES
    ],
})
export class AccountModule { }
