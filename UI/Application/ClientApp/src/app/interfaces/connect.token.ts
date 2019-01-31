export interface IConnectToken {
    grant_type: string;
    scope: string;
    username?: string;
    password?: string;
    refresh_token?: string;
}