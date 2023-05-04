import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootBlogStore } from '../../reducers';
import * as State from './reducer';

const getModule = createFeatureSelector< State.FileState>('file');
const getAll = (s: State.FileState) => s && State.selectAll(s);
const getTotal = (s: State.FileState) => s && State.selectTotal(s);
const getTotalAmount = (s: State.FileState) => s.totalAmount;
const getFile = (s: State.FileState) => s && State.selectEntities(s)[s.selectedFileId];

export const selectFiles = createSelector(getModule, getAll);
export const selectFileTotalAmount = createSelector(getModule, getTotalAmount);
export const selectFileTotal = createSelector(getModule, getTotal);
export const selectSelectedFile = createSelector(getModule, getFile);
