import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { FileActionsUnion } from './actions';
import { FileModel } from './file.model';
import { FileTypes } from './types';

export interface FileState extends EntityState<FileModel> {
    selectedFileId?: string;
    totalAmount?: number;
}

const selectId = (i: FileModel) => i.fileId;
const sortComparer = (a: FileModel, b: FileModel) => new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();
const adapter = createEntityAdapter({ selectId, sortComparer });
export const { selectAll, selectTotal, selectEntities } = adapter.getSelectors();
const INITIAL_STATE: FileState = adapter.getInitialState({});

export function fileReducer(state = INITIAL_STATE, action: FileActionsUnion): FileState {

    switch (action.type) {

        case FileTypes.UPLOAD_FILE_SUCCESS: return adapter.addMany(action.success.items, state);
        case FileTypes.GET_FILES_SUCCESS: return {
            ...adapter.addMany(action.success.items, state),
            totalAmount: action.success.totalAmount
        };
        case FileTypes.SELECT_FILE: return { ...state, selectedFileId: action.payload.fileId };
        case FileTypes.DELETE_FILES: return INITIAL_STATE;
        case FileTypes.DELETE_FILE_SUCCESS: return adapter.removeOne(action.payload, state);

        default: return state;
    }
}
