import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgxHttpParamsService } from 'projects/ngx-http-params/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-http-params-demo';

    constructor(
        private util: NgxHttpParamsService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.http.get('https://httpbin.org/get', {
            params: this.util.getParams({
                param1: 'val1',
                param2: 2,
                numbers: [1, 2, 3, 4],
                fruits: ['apple', 'pear', 'peach'],
                vegetables: { tomato: 1, potato: 0.5, cucumber: 4 },
            })
        }).subscribe(console.log);
    }
}
