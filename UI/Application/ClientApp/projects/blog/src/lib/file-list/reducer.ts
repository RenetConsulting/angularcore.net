import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { FileActionsUnion } from './actions';
import { FileModel } from './file.model';
import { FileTypes } from './types';

export interface FileState extends EntityState<FileModel> {
    selectedFileId?: string;
    itemsAmount?: number;
    loading?: boolean;
}

const selectId = (i: FileModel) => i.fileId;

const sortComparer = (a: FileModel, b: FileModel) =>
    new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();

const adapter = createEntityAdapter({ selectId, sortComparer });

export const { selectAll: getFiles, selectEntities: getFileEntities, selectTotal: getFilesTotal } = adapter.getSelectors();

const INITIAL_STATE: FileState = adapter.getInitialState({});

export function fileReducer(state = INITIAL_STATE, action: FileActionsUnion): FileState {

    switch (action.type) {

        case FileTypes.UPLOAD_FILE_REQUEST: return { ...state, loading: true };
        case FileTypes.UPLOAD_FILE_SUCCESS: return { ...adapter.addOne(action.success, state), loading: false };
        case FileTypes.UPLOAD_FILE_ERROR: return { ...state, loading: false };

        case FileTypes.GET_FILES_REQUEST: return { ...state, loading: true };
        case FileTypes.GET_FILES_SUCCESS: {

            const itemsAmount = action.success.itemsAmount;
            const items = action.success.items;
            return { ...adapter.addMany(items, state), itemsAmount, loading: false };
        }
        case FileTypes.GET_FILES_ERROR: return { ...state, loading: false };

        case FileTypes.DELETE_FILE_REQUEST: return { ...state, loading: true };
        case FileTypes.DELETE_FILE_SUCCESS: return { ...adapter.removeOne(action.payload, state), loading: false };
        case FileTypes.DELETE_FILE_ERROR: return { ...state, loading: false };

        case FileTypes.SELECT_FILE: return { ...state, selectedFileId: action.payload };

        default: return state;
    }
}