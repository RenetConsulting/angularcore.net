import { HttpClient } from '@angular/common/http';
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
        @Inject(HttpClient) public http: HttpClient,
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

    /** TODO: delete, this line just runs hub */
    runHubCreate = () => {
        this.http.get('https://localhost:44395/api/BlogHub/create').subscribe();
    }

    /** TODO: delete, this line just runs hub */
    runHubUpdate = () => {
        this.http.get('https://localhost:44395/api/BlogHub/update').subscribe();
    }
}
