import { ChangeDetectionStrategy, Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { selectSigninUser } from '~/components/authorization/signin/selectors';
import { RootStore } from '~/reducers';
import { ResendConfirmationRequest } from './actions';

@Component({
    selector: 'resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResendConfirmationComponent implements OnInit, OnDestroy {

    @Input() error: string;
    readonly subscription = new Subscription();
    email: string;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    ngOnInit(): void {
        this.subscription.add(this.store.select(selectSigninUser).subscribe(i => this.email = i && i.email));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    submit = (): void => {
        this.store.dispatch(new ResendConfirmationRequest(this.email));
    }
}
