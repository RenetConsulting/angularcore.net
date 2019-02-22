import { IUser } from "../../../interfaces/user";
import { SigninTypes } from "../signin/types";
import { SignupActionsUnion } from "./actions";
import { SignupTypes } from "./types";

export interface SignupState {
    user?: IUser
    error?
}

const INITIAL_STATE: SignupState = {};

export function signupReducer(state = INITIAL_STATE, action: SignupActionsUnion): SignupState {

    switch (action.type) {

        case SignupTypes.SIGNUP_REQUEST: {
            return { user: { ...action.payload.value } };
        }
        case SignupTypes.SIGNUP_SUCCESS: {
            return { ...state, error: null };
        }
        case SigninTypes.SIGNIN_SUCCESS: {
            return INITIAL_STATE;
        }
        case SignupTypes.SIGNUP_ERROR: {
            return { error: { ...action.error } };
        }
        default: {
            return state;
        }
    }
}