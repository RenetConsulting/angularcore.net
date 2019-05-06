import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgxHttpParamsService } from 'projects/ngx-http-params/src/public-api';
import { NgxLinkStylesheetService } from 'projects/ngx-link-stylesheet/src/public_api';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [NgxLinkStylesheetService]
})
export class AppComponent implements OnInit {

    title = 'ngx-utils-demo';

    constructor(
        private util: NgxHttpParamsService,
        private http: HttpClient,
        private link: NgxLinkStylesheetService
    ) { }

    ngOnInit(): void {
        this.http.get('https://httpbin.org/get', {
            params: this.util.map({
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: ['apple', 'pear', 'peach'],
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            })
        }).subscribe(console.log);
    }

    setTheme = () => {
        this.link.update('hello-bob', 'assets/test.css');
    }
}
