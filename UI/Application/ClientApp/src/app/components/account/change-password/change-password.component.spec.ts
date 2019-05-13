import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { ChangePasswordRequest, ResetError } from './actions';
import { ChangePasswordComponent } from './change-password.component';
import { ChangePasswordStore } from './reducer';
import { selectChangePasswordError } from './selectors';

describe('ChangePasswordComponent', () => {

    let component: ChangePasswordComponent;

    let store: MockStore<ChangePasswordStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.get(Store);
        component = new ChangePasswordComponent(store);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
    it('selectChangePasswordError', () => {
        const error = { password: 'bob wrong' };
        expect(selectChangePasswordError({ changePassword: { error } })).toEqual(error);
    });
    it('ngOnInit', () => {
        spyOn(component, 'setFormGroup');
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
    });
    it('ngOnDestroy', () => {
        spyOn(store, 'dispatch');
        component.ngOnDestroy();
        expect(store.dispatch).toHaveBeenCalledWith(new ResetError());
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new ChangePasswordRequest(component.formGroup));
    });
});