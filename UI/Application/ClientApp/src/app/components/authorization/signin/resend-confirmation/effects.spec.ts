import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { ResendConfirmationError, ResendConfirmationRequest, ResendConfirmationSuccess } from './actions';
import { ResendConfirmationEffects } from './effects';

describe('ResendConfirmationEffects', () => {

    let effects: ResendConfirmationEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ResendConfirmationEffects,
                provideMockActions(() => actions),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['resendConfirmation']) }
            ],
        });

        effects = TestBed.get(ResendConfirmationEffects);
        accountService = TestBed.get(AccountService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('resendConfirmationRequest', () => {

        const email = 'bob';

        it('success', () => {
            accountService.resendConfirmation.and.returnValue(of(null));
            const action = new ResendConfirmationRequest(email);
            const completion = new ResendConfirmationSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resendConfirmationRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'error';
            accountService.resendConfirmation.and.returnValue(throwError({ error }));
            const action = new ResendConfirmationRequest(email);
            const completion = new ResendConfirmationError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resendConfirmationRequest).toBeObservable(expected);
        });
    });
    it('resendConfirmationSuccess', () => {
        const action = new ResendConfirmationSuccess();
        const completion = new SetSuccess(MessagesType.checkEmail);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.resendConfirmationSuccess).toBeObservable(expected);
    });
});