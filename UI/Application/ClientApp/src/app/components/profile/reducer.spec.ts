import { Reset } from '~/actions/root.actions';
import { IPerson } from '~/interfaces/person';
import { GetProfileRequest, GetProfileSuccess, UpdateProfileSuccess } from './actions';
import { profileReducer } from './reducer';

describe('profileReducer', () => {

    it('UPDATE_PROFILE_SUCCESS', () => {
        const profile = {} as IPerson;
        expect(profileReducer({}, new UpdateProfileSuccess(profile))).toEqual({ profile });
    });
    it('GET_PROFILE_REQUEST', () => {
        expect(profileReducer({}, new GetProfileRequest())).toEqual({ profile: null });
    });
    it('GET_PROFILE_SUCCESS', () => {
        const profile = {} as IPerson;
        expect(profileReducer({}, new GetProfileSuccess(profile))).toEqual({ profile });
    });
    it('RESET', () => {
        expect(profileReducer({}, new Reset())).toEqual({});
    });
    it('default', () => {
        expect(profileReducer({}, { type: null })).toEqual({});
    });
});