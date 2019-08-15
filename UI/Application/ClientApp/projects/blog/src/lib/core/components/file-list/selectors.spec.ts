import { FileModel } from './file.model';
import { FileState } from './reducer';
import { selectFiles, selectFileTotalAmount } from './selectors';

describe('Selectors of file', () => {

    it('selectFiles', () => {
        const item = { fileId: 'bob' } as FileModel;
        expect(selectFiles({ file: { ids: [item.fileId], entities: { [item.fileId]: item } } })).toEqual([item]);
    });
    it('selecFileTotalAmount', () => {
        const totalAmount = 25;
        expect(selectFileTotalAmount({ file: { totalAmount } as FileState })).toEqual(totalAmount);
    });
});
