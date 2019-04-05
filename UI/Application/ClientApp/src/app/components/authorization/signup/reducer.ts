import { RootUnion } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { RootTypes } from '~/types/root.types';
import { SigninTypes } from '../signin/types';
import { SignupActionsUnion } from './actions';
import { SignupTypes } from './types';

export interface SignupState {
    user?: IUser;
    error?;
}

const INITIAL_STATE: SignupState = {};

export function signupReducer(state = INITIAL_STATE, action: SignupActionsUnion | RootUnion): SignupState {

    switch (action.type) {

        /** onSuccess the form will be reset */
        case SignupTypes.SIGNUP_REQUEST: return { user: { ...action.payload.value }, error: null };
        case SignupTypes.SIGNUP_ERROR: return { ...state, error: { ...action.error } };
        case SigninTypes.SIGNIN_SUCCESS: return INITIAL_STATE;
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}