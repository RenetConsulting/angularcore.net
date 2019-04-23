import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootBlogStore } from '../reducers';
import { FileState, getFiles, getFilesTotal } from './reducer';

const getModule = createFeatureSelector<RootBlogStore, FileState>('file');

const getAllFiles = (s: FileState) => s && getFiles(s);

const getFilesAmount = (s: FileState) => s.itemsAmount;

export const selectFiles = createSelector(getModule, getAllFiles);

export const selectFilesTotal = createSelector(getModule, getFilesTotal);

export const selectFilesAmount = createSelector(getModule, getFilesAmount);