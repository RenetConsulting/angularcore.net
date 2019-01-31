import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { IUser } from "../../../interfaces/user";
import { AuthorizationService } from "../../../services/authorization/authorization.service";

@Component({
    selector: "signup",
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.scss"]
})
export class SignupComponent implements OnInit {

    formGroup: FormGroup;

    constructor(
        @Inject(AuthorizationService) private authorizationService: AuthorizationService,
        @Inject(Router) private router: Router
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
            this.authorizationService.signin(this.formGroup.value).subscribe(() => this.router.navigate(["/home"]));
        }
    }
}
