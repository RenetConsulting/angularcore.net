import { createSelector } from '@ngrx/store';
import { RootStore } from '../../reducers';
import { MessagerState } from './reducer';

const getMessager = (i: RootStore) => i.messager;

const getError = (i: MessagerState) => i.error;

const getSuccessMessage = (i: MessagerState) => i.successMessage;

export const selectError = createSelector(getMessager, getError);

export const selectSuccessMessage = createSelector(getMessager, getSuccessMessage);