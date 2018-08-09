import { Component, Inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: "app-counter-component",
  templateUrl: "./counter.component.html"
})
export class CounterComponent {
  public currentCount = 0;

  public incrementCounter() {
    this.currentCount++;
  }

  constructor(@Inject(HttpClient) http: HttpClient) {
    http.get("https://httpbin.org/get").subscribe((s) => {
      console.log(s)
    })
  }
}
