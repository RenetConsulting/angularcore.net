import { ErrorActionsUnion } from "../../actions/error.actions";
import { IError } from "../../models/error.model";
import { ErrorTypes } from "../../types/error.types";

export interface State {
    error?: IError;
    successMessage?: string;
}

export const INITIAL_STATE: State = {};

export function reducer(state = INITIAL_STATE, action: ErrorActionsUnion): State {

    switch (action.type) {

        case ErrorTypes.PUSH_ERROR: {
            return { error: { ...action.payload } };
        }
        case ErrorTypes.SET_SUCCESS_MESSAGE: {
            return { successMessage: action.payload };
        }
        case ErrorTypes.RESET: {
            return INITIAL_STATE;
        }
        default: {
            return state;
        }
    }
}