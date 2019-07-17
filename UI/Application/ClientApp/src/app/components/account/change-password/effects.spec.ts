import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { IError } from '~/interfaces/error';
import { AccountService } from '~/services/account/account.service';
import { ChangePasswordError, ChangePasswordRequest, ChangePasswordSuccess } from './actions';
import { ChangePasswordEffects } from './effects';

describe('ChangePasswordEffects', () => {

    let effects: ChangePasswordEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                ChangePasswordEffects,
                provideMockActions(() => actions),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['changePassword']) }
            ],
        });

        effects = TestBed.get(ChangePasswordEffects);
        accountService = TestBed.get(AccountService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('changePasswordRequest', () => {

        let formGroup: FormGroup;

        beforeEach(() => {
            formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['reset']);
        });

        it('success', () => {
            accountService.changePassword.and.returnValue(of(null));
            const action = new ChangePasswordRequest(formGroup);
            const completion = new ChangePasswordSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.changePasswordRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            accountService.changePassword.and.returnValue(throwError(error));
            const action = new ChangePasswordRequest(formGroup);
            const completion = new ChangePasswordError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.changePasswordRequest).toBeObservable(expected);
        });
    });

    it('changePasswordSuccess', () => {
        const action = new ChangePasswordSuccess();
        const completion = new SetSuccess(MessagesType.passwordHasChanged);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.changePasswordSuccess).toBeObservable(expected);
    });
    it('changePasswordError', () => {
        const error = { error_description: 'bob error' } as IError;
        const action = new ChangePasswordError(error);
        const completion = new SetError(error);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.changePasswordError).toBeObservable(expected);
    });
});