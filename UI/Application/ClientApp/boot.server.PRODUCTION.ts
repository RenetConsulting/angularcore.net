import 'reflect-metadata';
import 'zone.js';
import 'rxjs/add/operator/first';
import { enableProdMode } from '@angular/core';
import { createServerRenderer } from 'aspnet-prerendering';
import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from '@nguniversal/aspnetcore-engine';
//import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from './modules/aspnetcore-engine/index';
const { AppModuleNgFactory } = require('./app/app.server.module.ngfactory'); // <-- ignore this - this is Production only

enableProdMode();

export default createServerRenderer((params) => {

    // Platform-server provider configuration
    const setupOptions: IEngineOptions = {
        appSelector: '<app></app>',
        ngModule: AppModuleNgFactory,
        request: params,
        providers: [
            // Optional - Any other Server providers you want to pass
            // (remember you'll have to provide them for the Browser as well)
        ]
    };

    return ngAspnetCoreEngine(setupOptions).then(response => {

        // Apply your transferData to response.globals
        response.globals.transferData = createTransferScript({
            someData: 'Transfer this to the client on the window.TRANSFER_CACHE {} object',
            fromDotnet: params.data.thisCameFromDotNET // example of data coming from dotnet, in HomeController
        });

        return ({
            html: response.html, // our <app> serialized
            globals: response.globals // all of our styles/scripts/meta-tags/link-tags for aspnet to serve up
        });
    });
});
