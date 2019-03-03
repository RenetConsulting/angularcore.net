import { Action } from '@ngrx/store';
import { ThemeTypes } from './types';

export class SetTheme implements Action {
    readonly type = ThemeTypes.SET_THEME;
    constructor(readonly payload: string) { }
}

export type ThemeActionsUnion = SetTheme;