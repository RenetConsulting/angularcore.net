import 'reflect-metadata';
import 'zone.js';
import 'rxjs/add/operator/first';
import { enableProdMode } from '@angular/core';
import { createServerRenderer, BootFuncParams } from 'aspnet-prerendering';
import { AppModule } from './app/app.module.server';
import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from './modules/aspnetcore-engine/index';

enableProdMode();

export default createServerRenderer((params: BootFuncParams) => {

    // Platform-server provider configuration
    const setupOptions: IEngineOptions = {
        appSelector: '<app></app>',
        ngModule: AppModule,
        request: params
    };

    return ngAspnetCoreEngine(setupOptions).then(response => {
        // Apply your transferData to response.globals
        response.globals.transferData = createTransferScript({
            someData: 'Transfer this to the client on the window.TRANSFER_CACHE {} object',
            fromDotnet: params.data.cameFromDotNET, // example of data coming from dotnet, in HomeController
            timeZone: params.data.timeZone
        });

        return ({
            html: response.html,
            globals: response.globals
        });
    });
});