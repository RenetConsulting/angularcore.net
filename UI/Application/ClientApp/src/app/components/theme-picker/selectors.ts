import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ThemeState } from './reducer';

const getModule = (s: RootStore) => s.theme;
const getTheme = (s: ThemeState) => s.selected;
const getItems = (s: ThemeState) => s.items;

export const selectSelectedTheme = createSelector(getModule, getTheme);
export const selectThemes = createSelector(getModule, getItems);