import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ALLOW_HTTP_ERROR_HEADER } from '../../consts/allow.http.error.header';
import { IChangePassword } from '../../interfaces/change.password';
import { IUser } from '../../interfaces/user';
import { BASE_URL } from '../../tokens/base.url';
import { ToolsService } from '../tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    /** the URL of a controller */
    readonly url = '/api/account';

    constructor(
        @Inject(BASE_URL) private baseUrl: string,
        @Inject(HttpClient) private http: HttpClient,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    changePassword = (model: IChangePassword) => this.http
        .post(`${this.baseUrl}${this.url}/ChangePassword`, model, { headers: { ALLOW_HTTP_ERROR_HEADER } })

    resetPassword = (model: IUser) => this.http
        .post(`${this.baseUrl}${this.url}/ResetPasswordFromMail`, model, { headers: { ALLOW_HTTP_ERROR_HEADER } })

    prepResetPassword = ({ email }: IUser) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.baseUrl}${this.url}/ResetPassword${body}`);
    }
}