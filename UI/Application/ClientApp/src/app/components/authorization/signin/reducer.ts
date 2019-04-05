import { RootUnion } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { RootTypes } from '~/types/root.types';
import { SigninActionsUnion } from './actions';
import { SigninTypes } from './types';

export interface SigninState {
    user?: IUser;
    error?;
}

const INITIAL_STATE: SigninState = {};

export function signinReducer(state = INITIAL_STATE, action: SigninActionsUnion | RootUnion): SigninState {

    switch (action.type) {

        /** onSuccess the form will be reset */
        case SigninTypes.SIGNIN_REQUEST: return { user: { ...action.payload.value }, error: null };
        case SigninTypes.SIGNIN_ERROR: return { ...state, error: { ...action.error } };
        case SigninTypes.RESET_ERROR: return { ...state, error: null };
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}