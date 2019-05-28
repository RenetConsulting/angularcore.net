import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { selectSelectedTheme, selectThemes } from './selectors';
import { ITheme } from './theme';

@Component({
    selector: 'theme-picker',
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemePickerComponent {

    readonly items = this.store.select(selectThemes);
    readonly selected = this.store.select(selectSelectedTheme);

    constructor(
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    select = (item: ITheme): void => this.store.dispatch(new SetTheme(item));
}
