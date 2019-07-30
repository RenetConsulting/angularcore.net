import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';

@NgModule({
    declarations: [StorageComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        StorageRoutingModule,
        ReactiveFormsModule
    ]
})
export class StorageModule { }
