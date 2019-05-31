import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { SetSettings } from '~/actions/settings.actions';
import { RootStore } from '~/reducers';
import { SettingsService } from '../settings/settings.service';

@Injectable({
    providedIn: 'root'
})
export class InitializerService {

    constructor(
        @Inject(SettingsService) private sttingsService: SettingsService,
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    initialize = () => this.sttingsService.get().pipe(
        tap(x => this.store.dispatch(new SetSettings(x)))
    ).toPromise()
}
