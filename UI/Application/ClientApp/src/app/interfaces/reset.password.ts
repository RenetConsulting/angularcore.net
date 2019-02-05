import { IUser } from './user';

export interface IResetPassword extends IUser {
    token: string;
}