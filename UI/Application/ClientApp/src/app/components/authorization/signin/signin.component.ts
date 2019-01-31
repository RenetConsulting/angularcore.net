import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { IUser } from "../../../interfaces/user";
import { AuthorizationService } from "../../../services/authorization/authorization.service";
import { Router } from "@angular/router";

@Component({
    selector: "signin",
    templateUrl: "./signin.component.html",
    styleUrls: ["./signin.component.scss"]
})
export class SigninComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router,

    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup(<MapPick<IUser, keyof IUser, FormControl>>{
            email: new FormControl("", [Validators.required, Validators.minLength(6), Validators.email]),
            password: new FormControl("", [Validators.required, Validators.minLength(6)])
        });
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.authorizationService.signin(this.formGroup.value).subscribe(() => this.router.navigate(["/sign-in"]));
        }
    }
}
