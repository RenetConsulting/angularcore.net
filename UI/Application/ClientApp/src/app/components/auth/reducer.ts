import { RootUnion } from '~/actions/root.actions';
import { IUser } from '~/interfaces/user';
import { RootTypes } from '~/types/root.types';
import { AuthActionsUnion } from './actions';
import { SigninActionsUnion } from './signin/actions';
import { SigninTypes } from './signin/types';
import { SignupActionsUnion } from './signup/actions';
import { SignupTypes } from './signup/types';
import { AuthTypes } from './types';

type ActionTypes = SigninActionsUnion | SignupActionsUnion | AuthActionsUnion | RootUnion;

export interface AuthState {
    authorized?: boolean;
    provider?: string;
    user?: IUser;
    signinError?;
    signupError?;
}

const INITIAL_STATE: AuthState = {};

export function authReducer(state = INITIAL_STATE, action: ActionTypes): AuthState {

    switch (action.type) {

        case SigninTypes.SIGNIN_REQUEST: return { user: { ...action.payload.value }, signinError: null };
        case SigninTypes.SIGNIN_ERROR: return { ...state, signinError: { ...action.error } };
        case SigninTypes.RESET_ERROR: return { ...state, signinError: null };

        case SignupTypes.SIGNUP_REQUEST: return { user: { ...action.payload.value }, signupError: null };
        case SignupTypes.SIGNUP_ERROR: return { ...state, signupError: { ...action.error } };
        case SigninTypes.SIGNIN_SUCCESS: return INITIAL_STATE;

        case AuthTypes.SET_AUTHORIZED: return { ...state, authorized: action.payload.authorized, provider: action.payload.provider };

        case RootTypes.RESET: return INITIAL_STATE;

        default: return state;
    }
}