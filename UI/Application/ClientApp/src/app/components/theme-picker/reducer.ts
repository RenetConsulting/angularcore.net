import { ThemeActionsUnion } from './actions';
import { THEME_OPTIONS } from './options';
import { ITheme } from './theme';
import { ThemeTypes } from './types';

export interface ThemeState {
    selected?: ITheme;
    items: Array<ITheme>;
}

const INITIAL_STATE: ThemeState = { items: [...THEME_OPTIONS] };

export function themeReducer(state = INITIAL_STATE, action: ThemeActionsUnion) {

    switch (action.type) {

        case ThemeTypes.SET_THEME: return { ...state, selected: state.items.find(i => i.name === action.payload) };
        default: return state;
    }
}