import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { IUser } from "../../interfaces/user";
import { AccountService } from "../../services/account/account.service";
import { MessageHandlerService } from "../../services/message.handler/message.handler.service";

@Component({
    selector: "change-password",
    templateUrl: "./change.password.component.html",
    styleUrls: ["./change.password.component.scss"]
})
export class ChangePasswordComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AccountService) private accountService: AccountService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup(<MapPick<IUser, keyof IUser, FormControl>>{
            email: new FormControl("", [Validators.required, Validators.minLength(6), Validators.email]),
            password: new FormControl("", [Validators.required, Validators.minLength(6)]),
            confirmPassword: new FormControl("", [Validators.required, Validators.minLength(6)]),
        });
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.accountService.changePassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess("The password has been changed successfully."));
        }
    }
}
