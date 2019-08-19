import { InjectionToken } from '@angular/core';
import ResizeObserver from 'resize-observer-polyfill';

export const RESIZE_OBSERVER = new InjectionToken<typeof ResizeObserver>('resize_observer', {
    providedIn: 'root',
    factory: () => ResizeObserver
});
