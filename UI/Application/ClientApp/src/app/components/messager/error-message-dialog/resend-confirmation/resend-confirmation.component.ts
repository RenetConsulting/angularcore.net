import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { AccountService } from '../../../account/account.service';

@Component({
    selector: 'resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResendConfirmationComponent {

    constructor(
        @Inject(AccountService) private accountService: AccountService
    ) { }

    /** TODO: add logic with getting an email */
    submit = (): void => {
        this.accountService.resendConfirmation(null).subscribe();
    }
}
