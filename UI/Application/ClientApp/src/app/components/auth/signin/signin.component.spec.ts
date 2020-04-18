import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { StorageService } from '@renet-consulting/storage';
import { of, Subscription } from 'rxjs';
import { SetError } from '~/actions/messenger.actions';
import { IError } from '~/interfaces/error';
import { IUser } from '~/interfaces/user';
import { RootStore } from '~/reducers';
import { ResetError, SigninRequest, ExternalSignin } from './actions';
import { SigninComponent } from './signin.component';
import { ErrorCodeService } from '@renet-consulting/external-auth';

describe('SigninComponent', () => {

    let component: SigninComponent;

    let store: MockStore<RootStore>;
    let storage: jasmine.SpyObj<StorageService>;
    let errorCode: jasmine.SpyObj<ErrorCodeService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        storage = jasmine.createSpyObj<StorageService>('StorageService', ['setStorage']);
        errorCode = jasmine.createSpyObj<ErrorCodeService>('ErrorCodeService', ['map']);

        component = new SigninComponent(store, storage, errorCode);
    });

    it('subscription', () => {
        expect(component.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnInit', () => {
        const user = { remember: true } as IUser;
        component.formGroup = { valueChanges: of(user), value: user } as FormGroup;
        spyOn(component, 'setFormGroup');
        spyOn(component, 'patchValue');
        spyOn(component, 'setStorage');
        store.setState({ auth: { user } });
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
        expect(component.patchValue).toHaveBeenCalledWith(user);
        expect(component.setStorage).toHaveBeenCalledWith(user);
        expect(component.setStorage).toHaveBeenCalledTimes(2);
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
        expect(store.dispatch).toHaveBeenCalledWith(new ExternalSignin(provider));
    });
    it('externalSigninError', () => {
        spyOn(store, 'dispatch');
        const error = { error_description: 'bob' } as IError;
        component.externalSigninError(error);
        expect(store.dispatch).toHaveBeenCalledWith(new SetError(error));
    });
});