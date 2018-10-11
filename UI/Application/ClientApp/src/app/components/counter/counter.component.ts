import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";

@Component({
    selector: "app-counter-component",
    templateUrl: "./counter.component.html"
})
export class CounterComponent {

    constructor(
        @Inject(HttpClient) public http: HttpClient
    ) {
        this.test();
    }

    public currentCount = 0;

    public incrementCounter() {
        this.currentCount++;
    }

    test = () => {
        this.http.get("https://httpbin.org/get").subscribe(console.log, console.log);
    }
}
