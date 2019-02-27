import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { PushError, SetError } from '../../actions/message.actions';
import { MessagesType } from '../../enums/messages.type';
import { IError } from '../../interfaces/error';
import { MessageTypes } from '../../types/message.types';

@Injectable()
export class MessagerEffects {

    constructor(
        @Inject(Actions) private actions: Actions
    ) { }

    @Effect() error = this.actions.pipe(
        ofType<SetError>(MessageTypes.SET_ERROR),
        map(i => i.payload),
        map(i => this.mapError(i)),
        map(i => new PushError(i))
    );

    mapError = (e: IError) => e && e.error_description && e.error_description.length < 1000 ? e : {
        ...(typeof e !== 'string' ? e : null),
        error_description: MessagesType.unspecifiedError
    }
}