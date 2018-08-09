import { HttpClient } from "@angular/common/http";
import { Component, Inject } from "@angular/core";

@Component({
    selector: "authorization",
    templateUrl: "./authorization.component.html",
    styleUrls: ["./authorization.component.scss"]
})
export class AuthorizationComponent {

    constructor(@Inject(HttpClient) http: HttpClient) {
        http.get("https://httpbin.org/get").subscribe((s) => {
            console.log(s)
        })
    }
}
