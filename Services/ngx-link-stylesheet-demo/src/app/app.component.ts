import { Component } from '@angular/core';
import { NgxLinkStylesheetService } from 'projects/ngx-link-stylesheet/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    providers: [NgxLinkStylesheetService]
})
export class AppComponent {
    title = 'ngx-link-stylesheet-demo';

    constructor(public service: NgxLinkStylesheetService) {
        service.updateLink('hello-bob', 'assets/test.css');
    }
}
