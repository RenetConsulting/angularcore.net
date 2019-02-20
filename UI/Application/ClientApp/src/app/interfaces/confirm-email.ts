import { IResetPassword } from "./reset-password";

export interface IConfirmEmail extends Pick<IResetPassword, 'email' | 'token'> { }
