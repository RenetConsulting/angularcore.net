import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { renderModule, renderModuleFactory } from '@angular/platform-server';
import { createServerRenderer } from 'aspnet-prerendering';
import 'reflect-metadata';
import 'zone.js/dist/zone-node';
import { BASE_URL } from './app/tokens/base-url.token';
export { AppServerModule } from './app/app.server.module';

enableProdMode();

export default createServerRenderer(params => {
    const { AppServerModule, AppServerModuleNgFactory, LAZY_MODULE_MAP } = (module as any).exports;

    const options = {
        document: params.data.originalHtml,
        url: params.url,
        extraProviders: [
            LAZY_MODULE_MAP,
            { provide: APP_BASE_HREF, useValue: params.baseUrl },
            { provide: BASE_URL, useValue: params.origin }
        ]
    };

    const renderPromise = AppServerModuleNgFactory
        ? /* AoT */ renderModuleFactory(AppServerModuleNgFactory, options)
        : /* dev */ renderModule(AppServerModule, options);

    return renderPromise.then(html => ({ html }));
});

export { renderModule, renderModuleFactory } from '@angular/platform-server';