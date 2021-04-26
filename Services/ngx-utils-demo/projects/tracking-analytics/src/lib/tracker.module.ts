import { ModuleWithProviders, NgModule, Provider } from '@angular/core';
import { NGX_BASE_URL } from './base-url.token';
import { NgxTrackerHttpFakeService, NgxTrackerHttpService } from './tracker-http.service';
import { NgxTrackerComponent } from './tracker.component';

export interface NgxTrackerModuleConfig {
    loader?: Provider;
    baseUrl?: Provider;
}

@NgModule({
    declarations: [NgxTrackerComponent],
    exports: [NgxTrackerComponent],
})
export class NgxTrackerModule {

    static forRoot(config: NgxTrackerModuleConfig): ModuleWithProviders<NgxTrackerModule> {
        return {
            ngModule: NgxTrackerModule,
            providers: [
                config.loader || { provide: NgxTrackerHttpService, useClass: NgxTrackerHttpFakeService },
                config.baseUrl || { provide: NGX_BASE_URL, useValue: '' },
            ]
        };
    }
}
