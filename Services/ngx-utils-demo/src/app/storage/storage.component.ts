import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { StorageService } from 'projects/storage/src/public-api';
// import { StorageService } from '@renet-consulting/storage';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

    formGroup = new UntypedFormGroup({
        key: new UntypedFormControl(),
        value: new UntypedFormControl()
    });

    constructor(
        private storage: StorageService
    ) { }

    ngOnInit() {
    }

    setStorage = () => {
        this.storage.set(this.formGroup.controls.key.value, this.formGroup.controls.value.value);
    }
}
