import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { NgxLinkStylesheetService } from '@renet-consulting/ngx-link-stylesheet';
import { StorageService } from '@renet-consulting/storage';
import { first, map, tap, withLatestFrom } from 'rxjs/operators';
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
        @Inject(NgxLinkStylesheetService) private stylesheet: NgxLinkStylesheetService
    ) { }

    @Effect() init = this.actions.pipe(
        ofType(ROOT_EFFECTS_INIT),
        first(),
        map(() => this.storageService.get(this.key)),
        withLatestFrom(this.store.select(selectThemes)),
        map(([selected, themes]) => selected ? selected : themes.find(i => i.isDefault)),
        map(i => new SetTheme(i))
    );

    @Effect({ dispatch: false }) setTheme = this.actions.pipe(
        ofType<SetTheme>(ThemeTypes.SET_THEME),
        map(a => a.payload),
        tap(i => i.isDefault ? this.stylesheet.delete(this.cssClass) : this.stylesheet.update(this.cssClass, `assets/${i.name}.css`)),
        tap(x => this.storageService.set(this.key, x)),
    );
}