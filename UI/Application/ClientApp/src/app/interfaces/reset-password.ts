import { IUser } from './user';

export interface IResetPassword extends Pick<IUser, 'email' | 'password' | 'confirmPassword'> {
    token: string;
}
