import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../../interfaces/user';
import { BASE_URL } from '../../tokens/base.url';
import { ToolsService } from '../tools/tools.service';

@Injectable({
    providedIn: 'root'
})
export class AccountService {

    constructor(
        @Inject(BASE_URL) private baseUrl: string,
        @Inject(HttpClient) private http: HttpClient,
        @Inject(ToolsService) private toolsService: ToolsService,
    ) { }

    changePassword = (_model: IUser): Observable<null> => {
        throw new Error('TODO: create the API');
    }

    resetPassword = (model: IUser) => this.http
        .post(`${this.baseUrl}/api/account/ResetPasswordFromMail`, model);

    prepResetPassword = ({ email }: IUser) => {
        const body = this.toolsService.getQuery({ email });
        return this.http
            .get(`${this.baseUrl}/api/account/ResetPassword${body}`);
    }
}
