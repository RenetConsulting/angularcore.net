import { Inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { NgxMessengerService } from '@renet-consulting/ngx-messenger';
import { filter, map, tap } from 'rxjs/operators';
import { SetError, SetSuccess } from '~/actions/messenger.actions';
import { Messages } from '~/consts/messages';
import { IError } from '~/interfaces/error';
import { MessengerTypes } from '~/types/messenger.types';

@Injectable()
export class MessengerEffects {

    constructor(
        @Inject(Actions) private actions: Actions,
        @Inject(NgxMessengerService) private messenger: NgxMessengerService,
    ) { }

     setError = createEffect(() => this.actions.pipe(
        ofType<SetError>(MessengerTypes.SET_ERROR),
        map(a => a.payload && (a.payload as IError).error_description
            || typeof a.payload === 'string' && (a.payload as string).length < 500 && a.payload
            || Messages.unspecifiedError),
        tap(this.messenger.error)
    ), { dispatch: false });
     setSuccess = createEffect(() => this.actions.pipe(
        ofType<SetSuccess>(MessengerTypes.SET_SUCCESS),
        map(a => a.payload),
        filter(i => !!i),
        tap(this.messenger.success)
    ), { dispatch: false });
}
