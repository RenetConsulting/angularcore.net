import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { first, map, tap } from 'rxjs/operators';
import { StorageService } from '../../services/storage/storage.service';
import { SetTheme } from './actions';
import { ThemeTypes } from './types';

@Injectable()
export class ThemeEffects {

    readonly key = 'theme';

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(StorageService) private storageService: StorageService,
    ) { }

    @Effect() init = this.actions.pipe(
        ofType(ROOT_EFFECTS_INIT),
        first(),
        map(() => this.storageService.get(this.key)),
        map(i => new SetTheme(i))
    );

    @Effect({ dispatch: false }) setTheme = this.actions.pipe(
        ofType<SetTheme>(ThemeTypes.SET_THEME),
        tap(i => this.storageService.set(this.key, i.payload)),
    );
}