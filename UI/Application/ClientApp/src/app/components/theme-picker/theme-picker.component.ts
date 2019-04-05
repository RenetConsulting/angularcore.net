import { ChangeDetectionStrategy, Component, Inject, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { NgxLinkStylesheetService } from '@renet-consulting/ngx-link-stylesheet';
import { tap } from 'rxjs/operators';
import { RootStore } from '~/reducers';
import { SetTheme } from './actions';
import { selectItems, selectTheme } from './selectors';
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

    readonly cssClass = 'link-theme';
    readonly items = this.store.select(selectItems);
    selected = this.store.select(selectTheme).pipe(
        tap(i => this.setSelected(i)));

    constructor(
        @Inject(Store) private store: Store<RootStore>,
        @Inject(NgxLinkStylesheetService) private stylesheetService: NgxLinkStylesheetService
    ) { }

    setTheme = (name: string): void => {
        this.store.dispatch(new SetTheme(name));
    }

    setSelected = (item: ITheme): void => {
        if (item) {
            if (item.isDefault) {
                this.stylesheetService.deleteLink(this.cssClass);
            }
            else {
                this.stylesheetService.updateLink(this.cssClass, `assets/${item.name}.css`);
            }
        }
    }
}
