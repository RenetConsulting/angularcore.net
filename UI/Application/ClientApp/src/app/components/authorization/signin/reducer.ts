import { IUser } from "../../../interfaces/user";
import { SigninActionsUnion } from "./actions";
import { SigninTypes } from "./types";

export interface SigninState {
    user?: IUser
    error?
}

const INITIAL_STATE: SigninState = {};

export function signinReducer(state = INITIAL_STATE, action: SigninActionsUnion): SigninState {

    switch (action.type) {

        case SigninTypes.SIGNIN_REQUEST: {
            return { user: { ...action.payload.value } };
        }
        case SigninTypes.SIGNIN_SUCCESS: {
            return { ...state, error: null };
        }
        case SigninTypes.SIGNIN_ERROR: {
            return { error: { ...action.error } };
        }
        default: {
            return state;
        }
    }
}