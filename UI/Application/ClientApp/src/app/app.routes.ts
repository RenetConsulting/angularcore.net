import { Route } from "@angular/router";
import { HomeComponent } from "./home/home.component";

export const ROUTES: Array<Route> = [
    { path: "", component: HomeComponent, pathMatch: "full" },
    { path: "counter", loadChildren: "./counter/counter.module#CounterModule" },
    { path: "sign-in", loadChildren: "./authorization/authorization.module#AuthorizationModule" },
    { path: "sign-up", loadChildren: "./authorization/authorization.module#AuthorizationModule" }
]
