import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { SetSuccess } from '~/actions/messenger.actions';
import { MessagesType } from '~/enums/messages.type';
import { AccountService } from '~/services/account/account.service';
import { ConfirmEmailRequest, ConfirmEmailSuccess } from './actions';
import { ConfirmEmailEffects } from './effects';

describe('ConfirmEmailEffects', () => {

    let effects: ConfirmEmailEffects;

    let actions: Observable<any>;
    let accountService: jasmine.SpyObj<AccountService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                ConfirmEmailEffects,
                provideMockActions(() => actions),
                { provide: AccountService, useValue: jasmine.createSpyObj<AccountService>('AccountService', ['confirmEmail']) }
            ],
        });

        effects = TestBed.get(ConfirmEmailEffects);
        accountService = TestBed.get(AccountService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });
    describe('confirmEmailRequest', () => {

        let formGroup: FormGroup;

        beforeEach(() => {
            formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['reset']);
        });

        it('success', () => {
            accountService.confirmEmail.and.returnValue(of(null));
            const action = new ConfirmEmailRequest(formGroup);
            const completion = new ConfirmEmailSuccess();
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.confirmEmailRequest).toBeObservable(expected);
        });
        it('error', () => {
            accountService.confirmEmail.and.returnValue(throwError(null));
            const action = new ConfirmEmailRequest(formGroup);
            const completion = new ConfirmEmailSuccess();
            const expected = cold('', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.confirmEmailRequest).toBeObservable(expected);
        });
    });
    it('confirmEmailSuccess', () => {
        const action = new ConfirmEmailSuccess();
        const completion = new SetSuccess(MessagesType.emailConfirmed);
        const expected = cold('--b', { b: completion });
        actions = hot('--a-', { a: action });
        expect(effects.confirmEmailSuccess).toBeObservable(expected);
    });
});