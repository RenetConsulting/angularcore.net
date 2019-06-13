import { Action } from '@ngrx/store';
import { ITheme } from './theme';
import { ThemeTypes } from './types';

export class SetTheme implements Action {
    readonly type = ThemeTypes.SET_THEME;
    constructor(readonly payload: ITheme) { }
}

export type ThemeActionsUnion = SetTheme;