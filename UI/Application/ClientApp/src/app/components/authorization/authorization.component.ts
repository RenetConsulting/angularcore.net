import { Component, Inject, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { FormBase } from "../../bases/form.base";
import { UserModel } from "../../models/user.model";
import { AuthorizationService } from "../../services/authorization/authorization.service";

@Component({
    selector: "authorization",
    templateUrl: "./authorization.component.html",
    styleUrls: ["./authorization.component.scss"]
})
export class AuthorizationComponent extends FormBase implements OnInit {

    item: UserModel = new UserModel();
    isSignin: boolean;
    buttonText: string;

    constructor(
        @Inject(AuthorizationService) public authorizationService: AuthorizationService,
        @Inject(Router) public router: Router
    ) {
        super();
    }

    ngOnInit(): void {
        this.setFormGroup();
        this.setIsSignin();
    }

    setFormGroup = (): void => {
        this.setFormControl<UserModel>("email", new FormControl(this.item.email));
        this.setFormControl<UserModel>("password", new FormControl(this.item.password));
        this.setFormControl<UserModel>("confirmPassword", new FormControl(this.item.confirmPassword));
    }

    setIsSignin = (): void => {
        this.isSignin = this.router.url == "/sign-in";
        this.buttonText = (this.isSignin) ? "Sign in" : "Sign up";
    }

    submit = (): void => {
        this.item = this.itemForm.value;
        if (this.isSignin) {
            this.authorizationService.signin(this.item).subscribe();
        }
        else {
            this.authorizationService.signup(this.item).subscribe();
        }
    }
}
