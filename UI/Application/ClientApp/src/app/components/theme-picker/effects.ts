import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { StorageService } from '@renet-consulting/storage';

import { map, tap, withLatestFrom } from 'rxjs/operators';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { selectThemes } from './selectors';
import { ThemeTypes } from './types';

@Injectable()
export class ThemeEffects {

    readonly key = 'theme';
    readonly cssClass = 'theme-picker';

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(Store) private store: Store<RootStore>,
        @Inject(StorageService) private storageService: StorageService,
        @Inject(DOCUMENT) private document: Document
    ) { }

     init = createEffect(() => this.actions.pipe(
        ofType(ROOT_EFFECTS_INIT),
        map(() => this.storageService.get(this.key)),
        withLatestFrom(this.store.select(selectThemes)),
        map(([selected, themes]) => selected ? selected : themes.find(i => i.isDefault)),
        map(i => new SetTheme(i)),
    ));

     setTheme = createEffect(() => this.actions.pipe(
        ofType<SetTheme>(ThemeTypes.SET_THEME),
        map(a => a.payload),
        tap(i => {
            const classList = this.document.body.classList[0] ? this.document.body.classList[0] : 'empty';

            if (i.isDefault) {
                this.document.body.classList.remove(classList);
            } else if (classList !== i.name) {
                this.document.body.classList.remove(classList);
                this.document.body.classList.add(i.name);
            }
        }),
        tap(x => this.storageService.set(this.key, x)),
    ), { dispatch: false });
}