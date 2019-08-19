import { IResponseList } from '../../response-list';
import * as UIActions from './actions';
import { FileModel } from './file.model';
import { fileReducer, FileState } from './reducer';

describe('fileReducer', () => {

    let state: FileState;

    beforeEach(() => {
        state = { ids: [], entities: {} };
    });

    it('UPLOAD_FILE_SUCCESS', () => {
        const item = { fileId: 'bob' } as FileModel;
        expect(fileReducer({
            ...state,
            totalAmount: 0
        }, new UIActions.UploadFileSuccess({ items: [item] } as IResponseList<FileModel>))).toEqual({
            ids: [item.fileId],
            entities: { [item.fileId]: item },
            totalAmount: 1
        } as FileState);
    });
    it('GET_FILES_SUCCESS', () => {
        const totalAmount = 59;
        expect(fileReducer(state, new UIActions.GetFilesSuccess({ items: [], totalAmount }))).toEqual({
            ...state,
            totalAmount
        } as FileState);
    });
    it('DELETE_FILE_SUCCESS', () => {
        const item = { fileId: 'bob' } as FileModel;
        expect(fileReducer({
            ids: [item.fileId],
            entities: { [item.fileId]: item },
            totalAmount: 2
        }, new UIActions.DeleteFileSuccess(item.fileId))).toEqual({
            ...state,
            totalAmount: 1
        });
    });
    it('default', () => {
        expect(fileReducer(state, { type: null } as any)).toEqual(state);
    });
});
