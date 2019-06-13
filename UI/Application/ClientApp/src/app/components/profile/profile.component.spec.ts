import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Subscription } from 'rxjs';
import { IPerson } from '~/interfaces/person';
import { RootStore } from '~/reducers';
import { GetProfileRequest, UpdateProfileRequest } from './actions';
import { ProfileComponent } from './profile.component';

describe('ProfileComponent', () => {

    let component: ProfileComponent;

    let store: MockStore<RootStore>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [provideMockStore({})],
        });
        store = TestBed.get(Store);

        component = new ProfileComponent(store);
    });

    it('subscription to be definted', () => {
        expect(component.subscription instanceof Subscription).toEqual(true);
    });
    it('ngOnInit', () => {
        spyOn(store, 'dispatch');
        spyOn(component, 'setFormGroup');
        const profile = {} as IPerson;
        spyOn(component, 'patchValue');
        store.setState({ profile: { profile } });
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
        expect(component.patchValue).toHaveBeenCalled();
        expect(store.dispatch).toHaveBeenCalledWith(new GetProfileRequest());
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('patchValue', () => {
        const person = {} as IPerson;
        component.formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['patchValue']);
        component.patchValue(person);
        expect(component.formGroup.patchValue).toHaveBeenCalledWith(person);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new UpdateProfileRequest(component.formGroup));
    });
});