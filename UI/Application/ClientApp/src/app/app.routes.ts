import { Route } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";

export const ROUTES: Array<Route> = [
    { path: "", redirectTo: "/home", pathMatch: "full" },

    { path: "home", component: HomeComponent },
    { path: "counter", loadChildren: "./components/counter/counter.module#CounterModule" },
    { path: "sign-in", loadChildren: "./components/authorization/signin/signin.module#SigninModule" },
    { path: "sign-up", loadChildren: "./components/authorization/signup/signup.module#SignupModule" },

    { path: "**", redirectTo: "/home" }
]
