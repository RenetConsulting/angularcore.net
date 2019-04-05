import { MessageActionsUnion } from '~/actions/message.actions';
import { RootUnion } from '~/actions/root.actions';
import { IError } from '~/interfaces/error';
import { MessageTypes } from '~/types/message.types';
import { RootTypes } from '~/types/root.types';

export interface MessagerState {
    error?: IError;
    message?: string;
}

export const INITIAL_STATE: MessagerState = {};

export function messagerReducer(state = INITIAL_STATE, action: MessageActionsUnion | RootUnion): MessagerState {

    switch (action.type) {

        case MessageTypes.ERROR_REQUEST: return { ...state, error: null };
        case MessageTypes.ERROR_SUCCESS: return { ...state, error: { ...action.payload } };
        case MessageTypes.MESSAGE_REQUEST: return { ...state, message: null };
        case MessageTypes.MESSAGE_SUCCESS: return { ...state, message: action.payload };
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}