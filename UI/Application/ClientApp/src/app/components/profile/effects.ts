import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mapTo, mergeMap, tap } from 'rxjs/operators';
import { PersonService } from '~/services/person/person.service';
import { GetProfileError, GetProfileRequest, GetProfileSuccess, UpdateProfileError, UpdateProfileRequest, UpdateProfileSuccess } from './actions';
import { ProfileTypes } from './types';

@Injectable()
export class ProfileEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(PersonService) private personService: PersonService,
    ) { }

    @Effect() updateProfileRequest = this.actions.pipe(
        ofType<UpdateProfileRequest>(ProfileTypes.UPDATE_PROFILE_REQUEST),
        mergeMap(x => this.personService.update(x.payload.value).pipe(
            tap(() => x.payload.reset()),
            mapTo(new UpdateProfileSuccess(x.payload.value)),
            catchError(e => of(new UpdateProfileError(e)))
        ))
    );

    @Effect() getProfileRequest = this.actions.pipe(
        ofType<GetProfileRequest>(ProfileTypes.GET_PROFILE_REQUEST),
        mergeMap(() => this.personService.getProfile().pipe(
            map(x => new GetProfileSuccess(x)),
            catchError(e => of(new GetProfileError(e)))
        ))
    );
}