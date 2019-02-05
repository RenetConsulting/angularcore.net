import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';

@Component({
    selector: 'app-counter-component',
    templateUrl: './counter.component.html'
})
export class CounterComponent {

    constructor(
        @Inject(HttpClient) public http: HttpClient
    ) { }

    public currentCount = 0;

    public incrementCounter() {
        this.currentCount++;
    }

    test = () => {
        for (var i = 0; i < 5; i++) {
            this.http.get(`https://httpbin.org/get?test=${i}`).subscribe(console.log, console.log);
        }
    }
}
