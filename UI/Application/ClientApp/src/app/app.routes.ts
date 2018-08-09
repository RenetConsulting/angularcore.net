import { Route } from '@angular/router';
import { FetchDataComponent } from "./fetch-data/fetch-data.component";
import { HomeComponent } from "./home/home.component";

export const ROUTES: Array<Route> = [
    { path: '', component: HomeComponent, pathMatch: 'full' },
    { path: 'fetch-data', component: FetchDataComponent },
    { path: "counter", loadChildren: "./counter/counter.module#CounterModule" }
]
