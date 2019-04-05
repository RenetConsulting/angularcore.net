import { RootUnion } from '~/actions/root.actions';
import { RootTypes } from '~/types/root.types';
import { ThemeActionsUnion } from './actions';
import { THEME_OPTIONS } from './options';
import { ITheme } from './theme';
import { ThemeTypes } from './types';

export interface ThemeState {
    selected?: ITheme;
    items: Array<ITheme>;
}

const INITIAL_STATE: ThemeState = { items: [...THEME_OPTIONS] };

export function themeReducer(state = INITIAL_STATE, action: ThemeActionsUnion | RootUnion) {

    switch (action.type) {

        case ThemeTypes.SET_THEME: return { ...state, selected: state.items.find(i => i.name === action.payload) };
        case RootTypes.RESET: return INITIAL_STATE;
        default: return state;
    }
}