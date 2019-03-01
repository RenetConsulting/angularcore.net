import { IDecodedCaptcha } from '@renet-consulting/core-captcha';

export interface IUser {
    email: string;
    password: string;
    confirmPassword: string;
    isRemember?: boolean;
    readTerms?: boolean;
    captcha?: IDecodedCaptcha;
}