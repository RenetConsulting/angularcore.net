import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { Messages } from '~/consts/messages';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { AccountService } from '~/services/account/account.service';
import { ResendConfirmationError, ResendConfirmationRequest, ResendConfirmationSuccess } from './actions';
import { ResendConfirmationEffects } from './effects';

describe('ResendConfirmationEffects', () => {

    let effects: ResendConfirmationEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;
    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ResendConfirmationEffects,
                provideMockActions(() => actions),
                provideMockStore({}),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['resendConfirmation']) }
            ],
        });
        store = TestBed.inject(Store as any);
        effects = TestBed.inject(ResendConfirmationEffects);
        accountService = TestBed.inject(AccountService as any);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('resendConfirmationRequest', () => {

        const email = 'bob';

        beforeEach(() => {
            store.setState({ auth: { user: { email } as IUser } });
        });

        it('success', () => {
            accountService.resendConfirmation.and.returnValue(of(null));
            const action = new ResendConfirmationRequest();
            const completion = new ResendConfirmationSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resendConfirmationRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'error';
            accountService.resendConfirmation.and.returnValue(throwError(error));
            const action = new ResendConfirmationRequest();
            const completion = new ResendConfirmationError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.resendConfirmationRequest).toBeObservable(expected);
        });
    });
    it('resendConfirmationSuccess', () => {
        const action = new ResendConfirmationSuccess();
        const completion = new SetSuccess(Messages.checkEmail);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.resendConfirmationSuccess).toBeObservable(expected);
    });
});
