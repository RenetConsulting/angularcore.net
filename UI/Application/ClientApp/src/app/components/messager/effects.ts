import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { PushError, SetError } from '../../actions/error.actions';
import { MessagesType } from '../../enums/messages.type';
import { ErrorTypes } from '../../types/error.types';

@Injectable()
export class MessagerEffects {

    constructor(
        @Inject(Actions) private actions: Actions
    ) { }

    @Effect() error = this.actions.pipe(
        ofType<SetError>(ErrorTypes.SET_ERROR),
        mergeMap(x => of(x).pipe(
            map(i => i.payload),
            map(i => i && i.error_description && i.error_description.length < 1000 ? i : {
                ...i,
                error_description: MessagesType.unspecifiedError
            }),
            map(i => new PushError(i))
        ))
    );
}