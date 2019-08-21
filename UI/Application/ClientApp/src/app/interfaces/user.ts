import { IDecodedCaptcha } from '@renet-consulting/core-captcha';

export interface IUser {
    email: string;
    password: string;
    confirmPassword: string;
    remember?: boolean;
    readTerms?: boolean;
    captcha?: IDecodedCaptcha;
}