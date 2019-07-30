import { InjectionToken } from '@angular/core';

export const NGX_A_NAME = new InjectionToken<string>('ngx-a-name', { providedIn: 'root', factory: () => 'ngx-a' });
