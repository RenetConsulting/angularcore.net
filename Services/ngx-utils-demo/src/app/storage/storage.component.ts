import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StorageService } from 'projects/storage/src/public-api';
//import { StorageService } from '@renet-consulting/storage';

@Component({
    selector: 'app-storage',
    templateUrl: './storage.component.html',
    styleUrls: ['./storage.component.css']
})
export class StorageComponent implements OnInit {

    formGroup = new FormGroup({
        key: new FormControl(),
        value: new FormControl()
    })

    constructor(
        private storage: StorageService
    ) { }

    ngOnInit() {
    }

    setStorage = () => {
        this.storage.set(this.formGroup.controls.key.value, this.formGroup.controls.value.value);
    }
}
