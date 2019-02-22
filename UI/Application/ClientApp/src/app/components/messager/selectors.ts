import { createSelector } from '@ngrx/store';
import { IError } from '../../models/error.model';
import { RootStore } from '../../reducers';
import * as Reducer from './reducer';

const getMessager = (i: RootStore) => i.messager;

const getError = (i: Reducer.State) => i.error;

const getSuccessMessage = (i: Reducer.State) => i.successMessage;

export const selectError = createSelector<RootStore, Reducer.State, IError>(
    getMessager,
    getError
);

export const selectSuccessMessage = createSelector<RootStore, Reducer.State, string>(
    getMessager,
    getSuccessMessage
);