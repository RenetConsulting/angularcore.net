import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Inject, Injector, NgModule } from '@angular/core';
import { createCustomElement } from '@angular/elements';
import { RouterModule } from '@angular/router';
import { NGX_A_NAME } from './ngx-a-name';
import { NgxAComponent } from './ngx-a.component';

@NgModule({
    declarations: [NgxAComponent],
    exports: [NgxAComponent],
    entryComponents: [NgxAComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    imports: [
        CommonModule,
        RouterModule
    ]
})
export class NgxAModule {

    constructor(
        @Inject(Injector) injector: Injector,
        @Inject(NGX_A_NAME) name: string,
    ) {
        if (!customElements.get(name)) {
            const ele = createCustomElement(NgxAComponent, { injector });
            customElements.define(name, ele);
        }
    }
}
