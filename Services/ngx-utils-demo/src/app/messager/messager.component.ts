import { Component, Inject, OnInit } from '@angular/core';
import { NgxMessagerService } from 'projects/ngx-messager/src/public-api';

@Component({
    selector: 'app-messager',
    templateUrl: './messager.component.html',
    styleUrls: ['./messager.component.css']
})
export class MessagerComponent implements OnInit {


    constructor(
        @Inject(NgxMessagerService) private messager: NgxMessagerService
    ) { }

    ngOnInit() {
    }

    error = () => {
        this.messager.error('Bob 1');
        this.messager.error('Bob 2');
    }

    success = () => {
        this.messager.success('Bob 1');
        this.messager.success('Bob 2');
    }
}
