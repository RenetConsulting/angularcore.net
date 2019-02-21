import { Component, Inject } from '@angular/core';
import { AccountService } from '../../services/account/account.service';

@Component({
    selector: 'app-resend-confirmation',
    templateUrl: './resend-confirmation.component.html',
    styleUrls: ['./resend-confirmation.component.scss']
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
