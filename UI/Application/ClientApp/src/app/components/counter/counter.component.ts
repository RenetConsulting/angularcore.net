import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
    selector: 'app-counter-component',
    templateUrl: './counter.component.html'
})
export class CounterComponent implements OnInit {

    constructor(
        @Inject(HttpClient) public http: HttpClient
    ) { }

    public currentCount = 0;

    ngOnInit(): void {
    }

    public incrementCounter() {
        this.currentCount++;
    }

    test = (length = 5) => {
        for (let i = 0; i < length; i++) {
            this.http.get(`https://httpbin.org/get?test=${i}`).subscribe(console.log, console.log);
        }
    }

    testError = () => {
        this.http.get(`testError`).subscribe();
    }
}
