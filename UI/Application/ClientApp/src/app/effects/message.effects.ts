import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NgxMessagerService } from '@renet-consulting/ngx-messager';
import { filter, map, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/message.actions';
import { MessagesType } from '~/enums/messages.type';
import { MessageTypes } from '~/types/message.types';

@Injectable()
export class MessageEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(NgxMessagerService) private messager: NgxMessagerService,
    ) { }

    @Effect({ dispatch: false }) setError = this.actions.pipe(
        ofType<SetError>(MessageTypes.SET_ERROR),
        map(a => a.payload && a.payload.error_description || MessagesType.unspecifiedError),
        filter(i => !!i),
        tap(this.messager.error)
    );
    @Effect({ dispatch: false }) setSuccess = this.actions.pipe(
        ofType<SetSuccess>(MessageTypes.SET_SUCCESS),
        map(a => a.payload),
        filter(i => !!i),
        tap(this.messager.success)
    );
}