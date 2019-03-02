import { createSelector } from '@ngrx/store';
import { RootStore } from '../../reducers';
import { MessagerState } from './reducer';

const getMessager = (i: RootStore) => i.messager;

const getError = (i: MessagerState) => i.error;

const getMessage = (i: MessagerState) => i.message;

export const selectError = createSelector(getMessager, getError);

export const selectMessage = createSelector(getMessager, getMessage);