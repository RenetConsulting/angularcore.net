import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AccountRoutingModule } from './account-routing.module';

const MODULES = [
    CommonModule,
    AccountRoutingModule,
];

@NgModule({
    imports: [
        ...MODULES
    ],
    exports: [
        ...MODULES
    ]
})
export class AccountModule { }
