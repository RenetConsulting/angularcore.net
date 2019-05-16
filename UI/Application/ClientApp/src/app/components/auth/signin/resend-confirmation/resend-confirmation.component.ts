import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ResendConfirmationRequest } from './actions';

@Component({
    selector: 'resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResendConfirmationComponent {

    @Input() error: string;

    constructor(
        @Inject(Store) private store: Store<RootStore>
    ) { }

    submit = (): void => {
        this.store.dispatch(new ResendConfirmationRequest());
    }
}
