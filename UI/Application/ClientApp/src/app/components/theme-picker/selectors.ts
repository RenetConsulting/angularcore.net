import { createSelector } from '@ngrx/store';
import { RootStore } from '~/reducers';
import { ThemeState } from './reducer';

const getModule = (state: RootStore) => state.theme;

const getTheme = (state: ThemeState) => state.selected;

const getItems = (state: ThemeState) => state.items;

export const selectTheme = createSelector(getModule, getTheme);

export const selectItems = createSelector(getModule, getItems);