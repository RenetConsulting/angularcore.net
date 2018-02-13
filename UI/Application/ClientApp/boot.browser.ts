import 'reflect-metadata';
import 'zone.js';
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module.browser';

if (module['hot']) {
    module['hot'].accept();
    module['hot'].dispose(() => {
        // Before restarting the app, we create a new root element and dispose the old one
        const oldRootElement = document.querySelector('app');
        const newRootElement = document.createElement('app');
        if (oldRootElement != null) {
            oldRootElement.parentNode.insertBefore(newRootElement, oldRootElement);
        }
        else {
            // oldElement is tag "PRE" in the current template (is Node returns an error template)
            let oldElement = document.querySelector('pre');
            if (oldElement != null) {
                document.body.insertBefore(newRootElement, oldElement);
                document.body.removeChild(oldElement);
            }
        }
        if (modulePromise != null) {
            modulePromise.then((appModule) => {
                appModule.destroy();
                if (oldRootElement != null && document.body.contains(oldRootElement)) {
                    document.body.removeChild(oldRootElement);
                }
            }, () => {
                if (oldRootElement != null) {
                    document.body.removeChild(oldRootElement);
                }
            });
        }
    });
}
else {
    enableProdMode();
}

// Note: @ng-tools/webpack looks for the following expression when performing production
// builds. Don't change how this line looks, otherwise you may break tree-shaking.
const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);
