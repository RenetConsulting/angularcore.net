import { TestBed } from '@angular/core/testing';
import { AbstractControl, FormGroup } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { PrepResetPasswordRequest, PrepResetPasswordSuccess } from './actions';
import { PrepResetPasswordEffects } from './effects';

describe('PrepResetPasswordEffects', () => {

    let effects: PrepResetPasswordEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                PrepResetPasswordEffects,
                provideMockActions(() => actions),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['prepResetPassword']) }
            ],
        });

        effects = TestBed.get(PrepResetPasswordEffects);
        accountService = TestBed.get(AccountService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('prepResetPasswordRequest', () => {

        let formGroup: FormGroup;
        let reset;

        beforeEach(() => {
            reset = jasmine.createSpy();
            const email = jasmine.createSpyObj<AbstractControl>('AbstractControl', ['reset']);
            formGroup = { controls: { email } as { [k: string]: AbstractControl }, reset } as FormGroup;
        });

        it('success', () => {
            accountService.prepResetPassword.and.returnValue(of(null));
            const action = new PrepResetPasswordRequest(formGroup);
            const completion = new PrepResetPasswordSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.prepResetPasswordRequest).toBeObservable(expected);
            expect(reset).toHaveBeenCalled();
        });
        it('error', () => {
            accountService.prepResetPassword.and.returnValue(throwError(null));
            const action = new PrepResetPasswordRequest(formGroup);
            const completion = new PrepResetPasswordSuccess();
            const expected = cold('', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.prepResetPasswordRequest).toBeObservable(expected);
        });
    });
    it('prepResetPasswordSuccess', () => {
        const action = new PrepResetPasswordSuccess();
        const completion = new SetSuccess(MessagesType.checkEmail);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.prepResetPasswordSuccess).toBeObservable(expected);
    });
});