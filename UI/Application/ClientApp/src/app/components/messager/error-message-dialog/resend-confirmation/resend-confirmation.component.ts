import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { RootStore } from '../../../../reducers';
import { selectSigninUser } from '../../../authorization/signin/selectors';
import { ResendConfirmation } from './actions';

@Component({
    selector: 'resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResendConfirmationComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    email: string;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit(): void {
        this.subscription.add(this.store.select(selectSigninUser).subscribe(i => this.email = i.email));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit = (): void => {
        this.store.dispatch(new ResendConfirmation(this.email));
    }
}
