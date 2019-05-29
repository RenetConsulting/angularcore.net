import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { IError } from '~/interfaces/error';
import { AccountService } from '~/services/account/account.service';
import { ResetPasswordError, ResetPasswordRequest, ResetPasswordSuccess } from './actions';
import { ResetPasswordEffects } from './effects';

describe('ResetPasswordEffects', () => {

    let effects: ResetPasswordEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ResetPasswordEffects,
                provideMockActions(() => actions),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['resetPassword']) }
            ],
        });

        effects = TestBed.get(ResetPasswordEffects);
        accountService = TestBed.get(AccountService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('resetPasswordRequest', () => {

        let formGroup: FormGroup;

        beforeEach(() => {
            formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['reset']);
        });

        it('success', () => {
            accountService.resetPassword.and.returnValue(of(null));
            const action = new ResetPasswordRequest(formGroup);
            const completion = new ResetPasswordSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resetPasswordRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            accountService.resetPassword.and.returnValue(throwError({ error }));
            const action = new ResetPasswordRequest(formGroup);
            const completion = new ResetPasswordError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resetPasswordRequest).toBeObservable(expected);
        });
    });
    it('resetPasswordSuccess', () => {
        const action = new ResetPasswordSuccess();
        const completion = new SetSuccess(MessagesType.passwordHasChanged);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.resetPasswordSuccess).toBeObservable(expected);
    });
    it('resetPasswordError', () => {
        const error = { error_description: 'bob error' } as IError;
        const action = new ResetPasswordError(error);
        const completion = new SetError(error);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.resetPasswordError).toBeObservable(expected);
    });
});