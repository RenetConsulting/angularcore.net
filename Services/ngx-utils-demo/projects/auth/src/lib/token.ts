/** the interface is based on {@link OpenIdConnectRequest} */
export interface IToken {
    access_token: string;
    refresh_token: string;
    expires_in: number;
    /** custom property that check time of authorization */
    expired_at: string;
    token_type: string;
}
