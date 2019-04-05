import { RootUnion } from '~/actions/root.actions';
import { IPerson } from '~/interfaces/person';
import { RootTypes } from '~/types/root.types';
import { ProfileUnion } from './actions';
import { ProfileTypes } from './types';

export interface ProfileState {
    profile?: IPerson;
    error?;
}

const INITIAL_STATE: ProfileState = {};

export function profileReducer(state = INITIAL_STATE, action: ProfileUnion | RootUnion): ProfileState {

    switch (action.type) {

        case ProfileTypes.UPDATE_PROFILE_REQUEST: return { profile: { ...action.payload.value } };
        case ProfileTypes.UPDATE_PROFILE_SUCCESS: return { ...state, error: null };
        case ProfileTypes.UPDATE_PROFILE_ERROR: return { ...state, error: { ...action.error } };
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}