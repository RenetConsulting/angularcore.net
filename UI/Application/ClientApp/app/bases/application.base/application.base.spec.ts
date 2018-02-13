/// <reference path="../../../../node_modules/@types/jasmine/index.d.ts" />

import { ApplicationBase } from '../bases';

describe('Base: ApplicationBase', () => {

    let base: ApplicationBase;

    beforeEach(() => {
        base = new ApplicationBase();
    });

    describe('methods', () => {
        it('resetMessages', () => {
            base.errorMessage = 'errorMessage';
            base.successMessage = 'successMessage';
            base.resetMessages();
            expect(base.errorMessage).toEqual(null);
            expect(base.successMessage).toEqual(null);
        });
    });
});
