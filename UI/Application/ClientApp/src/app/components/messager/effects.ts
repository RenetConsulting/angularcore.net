import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { map } from 'rxjs/operators';
import { ErrorRequest, ErrorSuccess, MessageRequest, MessageSuccess } from '../../actions/message.actions';
import { MessagesType } from '../../enums/messages.type';
import { IError } from '../../interfaces/error';
import { MessageTypes } from '../../types/message.types';

@Injectable()
export class MessagerEffects {

    constructor(
        @Inject(Actions) private actions: Actions
    ) { }

    @Effect() errorRequest = this.actions.pipe(
        ofType<ErrorRequest>(MessageTypes.ERROR_REQUEST),
        map(i => i.payload),
        map(i => this.mapError(i)),
        map(i => new ErrorSuccess(i))
    );

    @Effect() messageSuccess = this.actions.pipe(
        ofType<MessageRequest>(MessageTypes.MESSAGE_REQUEST),
        map(i => i.payload),
        map(i => new MessageSuccess(i))
    );

    mapError = (e: IError) => e && e.error_description && e.error_description.length < 1000 ? e : {
        ...(typeof e !== 'string' ? e : null),
        error_description: MessagesType.unspecifiedError
    }
}