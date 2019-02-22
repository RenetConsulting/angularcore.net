import { ErrorActionsUnion } from '../../actions/error.actions';
import { IError } from '../../interfaces/error';
import { ErrorTypes } from '../../types/error.types';

export interface MessagerState {
    error?: IError;
    successMessage?: string;
}

export const INITIAL_STATE: MessagerState = {};

export function messagerReducer(state = INITIAL_STATE, action: ErrorActionsUnion): MessagerState {

    switch (action.type) {

        case ErrorTypes.PUSH_ERROR: {
            return { error: { ...action.payload } };
        }
        case ErrorTypes.SET_SUCCESS_MESSAGE: {
            return { successMessage: action.payload };
        }
        default: {
            return state;
        }
    }
}