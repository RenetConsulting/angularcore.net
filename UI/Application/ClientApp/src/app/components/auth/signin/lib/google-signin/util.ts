declare var gapi;

export const signout = (): void => {
    const auth = gapi && gapi.auth2.getAuthInstance();
    if (auth) {
        auth.signOut();
    }
};