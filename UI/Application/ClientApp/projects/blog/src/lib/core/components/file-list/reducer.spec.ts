import { IResponseList } from '../../response-list';
import * as UIActions from './actions';
import { FileModel } from './file.model';
import { fileReducer, FileState } from './reducer';

describe('fileReducer', () => {

    let state: FileState;

    beforeEach(() => {
        state = { ids: [], entities: {} };
    });

    it('CREATE_BLOG_SUCCESS', () => {
        const item = { fileId: 'bob' } as FileModel;
        expect(fileReducer(state, new UIActions.UploadFileSuccess({ items: [item] } as IResponseList<FileModel>))).toEqual({
            ids: [item.fileId],
            entities: { [item.fileId]: item }
        } as FileState);
    });
    it('GET_BLOGS_SUCCESS', () => {
        const totalAmount = 59;
        expect(fileReducer(state, new UIActions.GetFilesSuccess({ items: [], totalAmount }))).toEqual({
            ...state,
            totalAmount
        } as FileState);
    });
    it('DELETE_BLOG_SUCCESS', () => {
        const item = { fileId: 'bob' } as FileModel;
        expect(fileReducer({
            ids: [item.fileId],
            entities: { [item.fileId]: item }
        }, new UIActions.DeleteFileSuccess(item.fileId))).toEqual(state);
    });
    it('default', () => {
        expect(fileReducer(state, { type: null } as any)).toEqual(state);
    });
});
