import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_HEADERS } from '~/consts/http-headers';
import { IChangePassword } from '~/interfaces/change-password';
import { IConfirmEmail } from '~/interfaces/confirm-email';
import { IResetPassword } from '~/interfaces/reset-password';
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
        .post(`${this.url}/password/change`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    prepResetPassword = (email: string) => {
        const query = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.url}/password/send/token${query}`);
    }

    resetPassword = (model: IResetPassword) => this.http
        .post(`${this.url}/password/reset`, model, { headers: { ...HTTP_HEADERS.allowHttpError } })

    confirmEmail = (model: IConfirmEmail) => {
        const query = this.toolsService.getQuery(model);
        return this.http
            .get(`${this.url}/email/confirm${query}`);
    }

    resendConfirmation = (email: string) => {
        const query = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.url}/email/send/token${query}`);
    }
}