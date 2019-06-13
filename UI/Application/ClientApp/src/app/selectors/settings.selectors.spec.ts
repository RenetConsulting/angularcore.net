import { selectFacebookAppId, selectGoogleClientId } from './settings.selectors';

describe('settings selectors', () => {

    it('selectFacebookAppId', () => {
        const facebookAppId = 'qwe-123';
        expect(selectFacebookAppId({ settings: { facebookAppId } })).toEqual(facebookAppId);
    });
    it('selectGoogleClientId', () => {
        const googleClientId = '123-qwe';
        expect(selectGoogleClientId({ settings: { googleClientId } })).toEqual(googleClientId);
    });
});