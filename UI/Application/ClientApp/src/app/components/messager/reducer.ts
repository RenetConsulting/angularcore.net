import { MessageActionsUnion } from '../../actions/message.actions';
import { IError } from '../../interfaces/error';
import { MessageTypes } from '../../types/message.types';

export interface MessagerState {
    error?: IError;
    successMessage?: string;
}

export const INITIAL_STATE: MessagerState = {};

export function messagerReducer(state = INITIAL_STATE, action: MessageActionsUnion): MessagerState {

    switch (action.type) {

        case MessageTypes.PUSH_ERROR: {
            return { error: { ...action.payload } };
        }
        case MessageTypes.SET_SUCCESS_MESSAGE: {
            return { successMessage: action.payload };
        }
        default: {
            return state;
        }
    }
}