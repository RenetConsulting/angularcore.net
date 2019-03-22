import { Inject, Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { catchError, mapTo, mergeMap, tap } from "rxjs/operators";
import { PersonService } from "../../services/person/person.service";
import { UpdatePersonError, UpdatePersonRequest, UpdatePersonSuccess } from "./actions";
import { SettingsTypes } from "./types";

@Injectable()
export class SettingsEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(PersonService) private personService: PersonService,
    ) { }

    @Effect() ppdatePersonRequest = this.actions.pipe(
        ofType<UpdatePersonRequest>(SettingsTypes.UPDATE_PERSON_REQUEST),
        mergeMap(x => this.personService.update(x.payload.value).pipe(
            tap(() => x.payload.reset()),
            mapTo(new UpdatePersonSuccess()),
            catchError(e => of(new UpdatePersonError(e.error)))
        ))
    );
}