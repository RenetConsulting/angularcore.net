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

    test = (length = 2) => {
        for (let i = 0; i < length; i++) {
            this.http.get(`https://httpbin.org/get?test=${i}`).subscribe(console.log, console.log);
        }
    }

    testError = () => {
        this.http.get(`/testError`).subscribe();
    }

    refresh = (): void => {
        if (typeof localStorage !== 'undefined') {
            var key = 'token'
            var token = JSON.parse(localStorage.getItem(key))
            if (token) {
                token.expired_at = Date.now();
                localStorage.setItem(key, JSON.stringify(token))
            }
        }
        this.test();
    }
}
