import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { IUser } from "../../interfaces/user";
import { AuthorizationService } from "../../services/authorization/authorization.service";
import { MessageHandlerService } from "../../services/message.handler/message.handler.service";

/** Preparation to reset a password */
@Component({
    selector: "prep-reset-password",
    templateUrl: "./prep.reset.password.component.html",
    styleUrls: ["./prep.reset.password.component.scss"]
})
export class PrepResetPasswordComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup(<MapPick<IUser, keyof IUser, FormControl>>{
            email: new FormControl("", [Validators.required, Validators.minLength(6), Validators.email]),
        });
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.authorizationService.prepResetPassword(this.formGroup.value)
                .pipe(
                    tap(() => this.formGroup.reset()))
                .subscribe(() => this.messageHandlerService.handleSuccess("Please check your email."));
        }
    }
}
