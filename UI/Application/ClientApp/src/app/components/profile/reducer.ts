import { RootUnion } from '~/actions/root.actions';
import { IPerson } from '~/interfaces/person';
import { RootTypes } from '~/types/root.types';
import { ProfileUnion } from './actions';
import { ProfileTypes } from './types';

export interface ProfileState {
    profile?: IPerson;
}

const INITIAL_STATE: ProfileState = {};

export function profileReducer(state = INITIAL_STATE, action: ProfileUnion | RootUnion): ProfileState {

    switch (action.type) {

        case ProfileTypes.UPDATE_PROFILE_SUCCESS: return { ...state, profile: { ...action.payload } };
        case ProfileTypes.GET_PROFILE_REQUEST: return { ...state, profile: null };
        case ProfileTypes.GET_PROFILE_SUCCESS: return { ...state, profile: { ...action.success } };
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}