import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { PrepResetPasswordRequest } from './actions';
import { PrepResetPasswordComponent } from './prep-reset-password.component';

describe('PrepResetPasswordComponent', () => {

    let component: PrepResetPasswordComponent;

    let store: MockStore<null>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });
        store = TestBed.inject(Store as any);
        component = new PrepResetPasswordComponent(store);
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'setFormGroup');
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new PrepResetPasswordRequest(component.formGroup));
    });
});