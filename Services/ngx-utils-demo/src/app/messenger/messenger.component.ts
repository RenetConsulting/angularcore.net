import { Component, Inject, OnInit } from '@angular/core';
import { NgxMessengerService } from 'projects/ngx-messenger/src/public-api';

@Component({
    selector: 'app-messenger',
    templateUrl: './messenger.component.html',
    styleUrls: ['./messenger.component.css']
})
export class MessagerComponent implements OnInit {


    constructor(
        @Inject(NgxMessengerService) private messenger: NgxMessengerService
    ) { }

    ngOnInit() {
    }

    error = () => {
        this.messenger.error('Bob 1');
        this.messenger.error('Bob 2');
    }

    success = () => {
        this.messenger.success('Bob 1');
        this.messenger.success('Bob 2');
    }
}
