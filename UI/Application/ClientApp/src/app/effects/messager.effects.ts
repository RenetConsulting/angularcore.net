import { Inject, Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { NgxMessagerService } from '@renet-consulting/ngx-messager';
import { filter, map, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messager.actions';
import { MessagesType } from '~/enums/messages.type';
import { MessagerTypes } from '~/types/messager.types';

@Injectable()
export class MessagerEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(NgxMessagerService) private messager: NgxMessagerService,
    ) { }

    @Effect({ dispatch: false }) setError = this.actions.pipe(
        ofType<SetError>(MessagerTypes.SET_ERROR),
        map(a => a.payload && a.payload.error_description || MessagesType.unspecifiedError),
        tap(this.messager.error)
    );
    @Effect({ dispatch: false }) setSuccess = this.actions.pipe(
        ofType<SetSuccess>(MessagerTypes.SET_SUCCESS),
        map(a => a.payload),
        filter(i => !!i),
        tap(this.messager.success)
    );
}