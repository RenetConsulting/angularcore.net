import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxLinkStylesheetService } from '@renet-consulting/ngx-link-stylesheet';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { selectThemes, selectSelectedTheme } from './selectors';
import { ITheme } from './theme';

@Component({
    selector: 'theme-picker',
    templateUrl: './theme-picker.component.html',
    styleUrls: ['./theme-picker.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [NgxLinkStylesheetService]
})
export class ThemePickerComponent {

    readonly items = this.store.select(selectThemes);
    readonly selected = this.store.select(selectSelectedTheme);

    constructor(
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    select = (item: ITheme): void => this.store.dispatch(new SetTheme(item));
}
