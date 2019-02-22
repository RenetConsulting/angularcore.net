import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EMAIL_VALIDATORS } from '../../consts/email.validators';
import { Messages } from '../../enums/messages.type';
import { IConfirmEmail } from '../../interfaces/confirm-email';
import { AccountService } from '../../services/account/account.service';
import { MessageHandlerService } from '../../services/message-handler/message-handler.service';

@Component({
    selector: 'confirm-email',
    templateUrl: './confirm-email.component.html',
    styleUrls: ['../signup/signup.component.scss']
})
export class ConfirmEmailComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(ActivatedRoute) private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.queryParams
            .subscribe((i: Pick<IConfirmEmail, 'token'>) => this.formGroup.controls.token.reset(i.token)));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            email: new FormControl('', [...EMAIL_VALIDATORS]),
            token: new FormControl('', [Validators.required]),
        } as MapPick<IConfirmEmail, keyof IConfirmEmail, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.confirmEmail(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess(Messages.emailConfirmed));
        }
    }
}
