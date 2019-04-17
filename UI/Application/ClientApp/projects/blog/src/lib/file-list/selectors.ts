import { createFeatureSelector, createSelector } from '@ngrx/store';
import { RootBlogStore } from '../reducers';
import { FileState, getFileEntities, getFiles, getFilesTotal } from './reducer';

const getModule = createFeatureSelector<RootBlogStore, FileState>('file');

const getAllFiles = (s: FileState) => s && getFiles(s);

const getSelectedFileId = (s: FileState) => s.selectedFileId;

const getFilesAmount = (s: FileState) => s.itemsAmount;

const getFileAllEntities = createSelector(getModule, getFileEntities);

export const selectFiles = createSelector(getModule, getAllFiles);

export const selectSelectedFileId = createSelector(getModule, getSelectedFileId);

export const selectSelectedFile = createSelector(getFileAllEntities, selectSelectedFileId, (entities, id) => entities[id]);

export const selectFilesTotal = createSelector(getModule, getFilesTotal);

export const selectFilesAmount = createSelector(getModule, getFilesAmount);