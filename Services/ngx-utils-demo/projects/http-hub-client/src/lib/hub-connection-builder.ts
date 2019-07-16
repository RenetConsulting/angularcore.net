import { InjectionToken } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';

export const HUB_CONNECTION_BUILDER = new InjectionToken<typeof HubConnectionBuilder>('hub_connection_builder', {
    providedIn: 'root',
    factory: () => HubConnectionBuilder
});
