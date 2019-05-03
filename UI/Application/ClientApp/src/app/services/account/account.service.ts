import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { NgxHttpParamsService } from '@renet-consulting/ngx-http-params';
import { HTTP_HEADERS } from '~/consts/http-headers';
import { IChangePassword } from '~/interfaces/change-password';
import { IConfirmEmail } from '~/interfaces/confirm-email';
import { IResetPassword } from '~/interfaces/reset-password';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    readonly url = '/api/account';

    constructor(
        @Inject(HttpClient) private http: HttpClient,
        @Inject(NgxHttpParamsService) private params: NgxHttpParamsService,
    ) { }

    changePassword = (model: IChangePassword) => this.http
        .post(`${this.url}/password/change`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    prepResetPassword = (email: string) => this.http
        .get(`${this.url}/password/send/token`, { params: this.params.map({ email }) });

    resetPassword = (model: IResetPassword) => this.http
        .post(`${this.url}/password/reset`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    confirmEmail = (model: IConfirmEmail) => this.http
        .get(`${this.url}/email/confirm`, { params: this.params.map(model) });

    resendConfirmation = (email: string) => this.http
        .get(`${this.url}/email/send/token`, { params: this.params.map({ email }) });
}