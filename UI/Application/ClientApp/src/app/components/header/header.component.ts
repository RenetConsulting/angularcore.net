import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { SignoutRequest } from '../auth/actions';
import { selectAuthorized } from '../auth/selectors';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

    readonly authorized = this.store.select(selectAuthorized);
    expanded: boolean;

    constructor(
        @Inject(Store) private store: Store<RootStore>,
    ) { }

    collapse = (): void => {
        this.expanded = false;
    }

    toggle = (): void => {
        this.expanded = !this.expanded;
    }

    signout = (): void => {
        this.store.dispatch(new SignoutRequest());
    }
}
