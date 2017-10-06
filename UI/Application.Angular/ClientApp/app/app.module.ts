//
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseSharedModule } from './app.module.shared';
import { ROUTES } from './app.routes';

import './rx-imports';
import './styles/styles';

import {
    AppComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent,
    NavMenuComponent,
    NotFoundComponent
} from './components/components';

import { LinkService } from './services/services';

//import { } from './directives/directives';
//import { } from './pipes/pipes';

const COMPONENTS = [
    AppComponent,
    NavMenuComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent,
    NotFoundComponent
];

const PROVIDERS = [
    LinkService
];

const DIRECTIVES = [];

const PIPES = [];

const MODULES = [
    RouterModule.forRoot(ROUTES),
    BaseSharedModule,
];


@NgModule({
    //bootstrap: [AppComponent],
    declarations: [
        ...PIPES,
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    imports: [
        ...MODULES
    ],
    providers: [
        ...PROVIDERS
    ]
})
export class AppModule { }