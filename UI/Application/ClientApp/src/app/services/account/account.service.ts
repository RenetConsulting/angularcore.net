import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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

    changePassword = (model: IUser) => this.http
        .post(`${this.baseUrl}${this.url}/ChangePassword`, model)

    resetPassword = (model: IUser) => this.http
        .post(`${this.baseUrl}${this.url}/ResetPasswordFromMail`, model)

    prepResetPassword = ({ email }: IUser) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.baseUrl}${this.url}/ResetPassword${body}`);
    }
}