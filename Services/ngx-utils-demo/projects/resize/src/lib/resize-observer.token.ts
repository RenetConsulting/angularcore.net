import { InjectionToken } from '@angular/core';

declare const ResizeObserver: any;

export const RESIZE_OBSERVER = new InjectionToken<any>('resize_observer', {
    providedIn: 'root',
    factory: () => typeof ResizeObserver !== 'undefined' ? ResizeObserver : null
});
