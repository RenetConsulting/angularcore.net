import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppSharedModule } from './app.shared.module';
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

import { MetadataService } from './services/services';

const COMPONENTS = [
    AppComponent,
    NavMenuComponent,
    CounterComponent,
    FetchDataComponent,
    HomeComponent,
    NotFoundComponent
];

const PROVIDERS = [
    MetadataService
];

const DIRECTIVES = [];

const PIPES = [];

const MODULES = [
    RouterModule.forRoot(ROUTES),
    AppSharedModule,
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
export class AppBaseModule { }