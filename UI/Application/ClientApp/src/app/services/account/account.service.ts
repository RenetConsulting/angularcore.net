import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_HEADERS } from '../../consts/http-headers';
import { IChangePassword } from '../../interfaces/change-password';
import { IConfirmEmail } from '../../interfaces/confirm-email';
import { IResetPassword } from '../../interfaces/reset-password';
import { ToolsService } from '../tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    readonly url = '/api/account';

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    changePassword = (model: IChangePassword) => this.http
        .post(`${this.url}/ChangePassword`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    confirmEmail = (model: IConfirmEmail) => {
        const body = this.toolsService.getQuery(model);
        return this.http
            .get(`${this.url}/ConfirmEmail${body}`);
    }

    prepResetPassword = (email: string) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.url}/ResetPassword${body}`);
    }

    resetPassword = (model: IResetPassword) => this.http
        .post(`${this.url}/ResetPasswordFromMail`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })


    resendConfirmation = (email: string) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.url}/ResendEmail${body}`);
    }
}