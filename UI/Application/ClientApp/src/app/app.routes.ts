import { Route } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";

export const ROUTES: Array<Route> = [
    { path: "", redirectTo: "/home", pathMatch: "full" },

    { path: "home", component: HomeComponent },
    { path: "counter", loadChildren: "./components/counter/counter.module#CounterModule" },
    { path: "sign-in", loadChildren: "./components/signin/signin.module#SigninModule" },
    { path: "sign-up", loadChildren: "./components/signup/signup.module#SignupModule" },
    { path: "prep-reset-password", loadChildren: "./components/prep.reset.password/prep.reset.password.module#PrepResetPasswordModule" },
    { path: "reset-password", loadChildren: "./components/reset.password/reset.password.module#ResetPasswordModule" },

    { path: "**", redirectTo: "/home" }
]
