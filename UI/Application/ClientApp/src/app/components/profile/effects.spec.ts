import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { IPerson } from '~/interfaces/person';
import { PersonService } from '~/services/person/person.service';
import { GetProfileError, GetProfileRequest, GetProfileSuccess, UpdateProfileError, UpdateProfileRequest, UpdateProfileSuccess } from './actions';
import { ProfileEffects } from './effects';

describe('ProfileEffects', () => {

    let effects: ProfileEffects;

    let actions: Observable<any>;
    let personService: jasmine.SpyObj<PersonService>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ProfileEffects,
                provideMockActions(() => actions),
                { provide: PersonService, useValue: jasmine.createSpyObj<PersonService>('PersonService', ['getProfile', 'update']) }
            ],
        });

        effects = TestBed.get(ProfileEffects);
        personService = TestBed.get(PersonService);
    });

    it('should work', () => {
        expect(effects).toBeDefined();
    });

    describe('updateProfileRequest', () => {

        let formGroup: FormGroup;

        beforeEach(() => {
            formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['reset']);
        });

        it('success', () => {
            personService.update.and.returnValue(of(null));
            const action = new UpdateProfileRequest(formGroup);
            const completion = new UpdateProfileSuccess(formGroup.value);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.updateProfileRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            personService.update.and.returnValue(throwError({ error }));
            const action = new UpdateProfileRequest(formGroup);
            const completion = new UpdateProfileError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.updateProfileRequest).toBeObservable(expected);
        });
    });

    describe('getProfileRequest', () => {

        it('success', () => {
            const person = {} as IPerson;
            personService.getProfile.and.returnValue(of(person));
            const action = new GetProfileRequest();
            const completion = new GetProfileSuccess(person);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getProfileRequest).toBeObservable(expected);
        });
        it('error', () => {
            const error = 'bob';
            personService.getProfile.and.returnValue(throwError({ error }));
            const action = new GetProfileRequest();
            const completion = new GetProfileError(error);
            const expected = cold('--b', { b: completion });
            actions = hot('--a-', { a: action });
            expect(effects.getProfileRequest).toBeObservable(expected);
        });
    });
});