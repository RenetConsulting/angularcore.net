import { ChangePasswordActionsUnion } from './actions';
import { ChangePasswordTypes } from './types';

export interface ChangePasswordState {
    error?;
}

export interface ChangePasswordStore {
    changePassword: ChangePasswordState;
}

const INITIAL_STATE: ChangePasswordState = {};

export function changePasswordReducer(state = INITIAL_STATE, action: ChangePasswordActionsUnion): ChangePasswordState {

    switch (action.type) {

        case ChangePasswordTypes.CHANGE_PASSWORD_REQUEST: {
            return INITIAL_STATE;
        }
        case ChangePasswordTypes.CHANGE_PASSWORD_ERROR: {
            return { error: { ...action.error } };
        }
        case ChangePasswordTypes.RESET_ERROR: {
            return { error: null };
        }
        default: {
            return state;
        }
    }
}