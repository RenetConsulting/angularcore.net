import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageRoutingModule } from './storage-routing.module';
import { StorageComponent } from './storage.component';

@NgModule({
    declarations: [StorageComponent],
    imports: [
        CommonModule,
        StorageRoutingModule,
        ReactiveFormsModule
    ]
})
export class StorageModule { }
