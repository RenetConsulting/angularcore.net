import { ResetPasswordActionsUnion } from './actions';
import { ResetPasswordTypes } from './types';

export interface ResetPasswordState {
    error?;
}

export interface ResetPasswordStore {
    resetPassword: ResetPasswordState;
}

const INITIAL_STATE: ResetPasswordState = {};

export function resetPasswordReducer(state = INITIAL_STATE, action: ResetPasswordActionsUnion): ResetPasswordState {

    switch (action.type) {

        case ResetPasswordTypes.RESET_PASSWORD_REQUEST: {
            return INITIAL_STATE;
        }
        case ResetPasswordTypes.RESET_PASSWORD_ERROR: {
            return { error: { ...action.error } };
        }
        case ResetPasswordTypes.RESET_ERROR: {
            return { error: null };
        }
        default: {
            return state;
        }
    }
}