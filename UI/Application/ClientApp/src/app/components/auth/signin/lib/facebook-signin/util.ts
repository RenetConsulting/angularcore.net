declare var FB;

export const signout = (fn?): void => {
    if (FB) {
        FB.logout(fn);
    }
};