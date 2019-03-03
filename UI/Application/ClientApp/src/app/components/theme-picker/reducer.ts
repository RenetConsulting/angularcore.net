import { ThemeActionsUnion } from './actions';
import { ITheme } from './theme';
import { ThemeTypes } from './types';

export interface ThemeState {
    selected?: ITheme;
    items: Array<ITheme>;
}

const INITIAL_STATE: ThemeState = {
    items: [
        { name: 'default', isDefault: true, },
        { primary: '#673AB7', accent: '#FFC107', name: 'deeppurple-amber.theme', isDark: false, },
        { primary: '#9C27B0', accent: '#4CAF50', name: 'purple-green.theme', isDark: true, },
    ]
};

export function themeReducer(state = INITIAL_STATE, action: ThemeActionsUnion) {

    switch (action.type) {

        case ThemeTypes.SET_THEME: {
            return { ...state, selected: state.items.find(i => i.name === action.payload) };
        }
        default: {
            return state;
        }
    }
}