import { IPerson } from '~/interfaces/person';
import { selectProfile } from './selectors';

describe('slectors', () => {

    it('selectProfile', () => {
        const profile = {} as IPerson;
        expect(selectProfile({ profile: { profile } })).toEqual(profile);
    });
});