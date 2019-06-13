import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';
import { SetError } from '~/actions/messenger.actions';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { SetAuthorized } from '../actions';
import { ResetError, SigninRequest } from './actions';
import { SigninComponent } from './signin.component';
import { IError } from '~/interfaces/error';

describe('SigninComponent', () => {

    let component: SigninComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        component = new SigninComponent(store);
    });

    it('subscription', () => {
        expect(component.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnInit', () => {
        spyOn(component, 'setFormGroup');
        spyOn(component, 'patchValue');
        const user = {} as IUser;
        store.setState({ auth: { user } });
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
        expect(component.patchValue).toHaveBeenCalledWith(user);
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        spyOn(store, 'dispatch');
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalledWith(new ResetError());
        expect(component.subscription.closed).toEqual(true);
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('patchValue', () => {
        const user = {} as IUser;
        component.formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['patchValue']);
        component.patchValue(user);
        expect(component.formGroup.patchValue).toHaveBeenCalledWith(user);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new SigninRequest(component.formGroup));
    });
    it('externalSignin', () => {
        spyOn(store, 'dispatch');
        const provider = 'bob';
        component.externalSignin(provider);
        expect(store.dispatch).toHaveBeenCalledWith(new SetAuthorized({ authorized: true, provider }));
    });
    it('externalSigninError', () => {
        spyOn(store, 'dispatch');
        const error = { error_description: 'bob' } as IError;
        component.externalSigninError(error);
        expect(store.dispatch).toHaveBeenCalledWith(new SetError(error));
    });
});