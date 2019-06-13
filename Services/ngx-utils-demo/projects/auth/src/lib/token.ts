/** the interface is based on {@link OpenIdConnectRequest} */
export interface IToken {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
    token_type?: string;
    grant_type?: string;
    scope?: string;
    state?: string;
    username?: string;
    password?: string;
    /** custom property that check time of authorization */
    expired_at?: string;
}
