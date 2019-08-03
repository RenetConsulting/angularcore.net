import { InjectionToken } from '@angular/core';
import { asyncScheduler } from 'rxjs';

export const SCHEDULER = new InjectionToken('scheduler', {
    providedIn: 'root',
    factory: () => asyncScheduler
});
