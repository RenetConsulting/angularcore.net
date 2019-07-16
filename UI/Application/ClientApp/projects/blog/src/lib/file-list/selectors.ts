import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootBlogStore } from '../reducers';
import * as State from './reducer';

const getModule = createFeatureSelector<RootBlogStore, State.FileState>('file');
const getAll = (s: State.FileState) => s && State.selectAll(s);
const getTotalAmount = (s: State.FileState) => s.totalAmount;

export const selectFiles = createSelector(getModule, getAll);
export const selectFileTotalAmount = createSelector(getModule, getTotalAmount);