import { Component, Inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { AccessService } from '~/services/access/access.service';
import { Signout } from '../authorization/actions';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    expanded = false;

    constructor(
        @Inject(Store) private store: Store<RootStore>,
        @Inject(AccessService) private accessService: AccessService,
    ) { }

    collapse = (): void => {
        this.expanded = false;
    }

    toggle = (): void => {
        this.expanded = !this.expanded;
    }

    signout = (): void => {
        this.store.dispatch(new Signout());
    }

    get authorized(): boolean {
        return this.accessService.authorized;
    }
}
