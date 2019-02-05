export interface IToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    expired_at: string;
    token_type: string;
}
