import { checkFileTypes, filterFileList, filterFiles, getFormData } from './utils';

describe('Utils', () => {

    describe('checkFileTypes', () => {
        it('case file name with point', () => {
            const file = new File([], 'file.png');
            const accept = '.png,.jpg,.gif';
            expect(checkFileTypes(file, accept)).toEqual(true);
        });
        it('case mime type', () => {
            const file = new File([], 'file.mp4', { type: 'video/mp4' });
            const accept = 'video/mp4,video/ogg';
            expect(checkFileTypes(file, accept)).toEqual(true);
        });
        it('case file name', () => {
            const file = new File([], 'file.png', { type: 'png' });
            const accept = 'png,jpg,gif';
            expect(checkFileTypes(file, accept)).toEqual(true);
        });
    });
    it('filterFiles', () => {
        const file = new File([], 'file.png');
        const accept = '.png,.jpg,.gif';
        expect(filterFiles([file], accept)).toEqual([file]);
    });
    describe('filterFileList', () => {
        it('multiple === true', () => {
            const file1 = new File([], 'file1.png');
            const file2 = new File([], 'file2.png');
            const files = [file1, file2];
            const accept = '.png,.jpg,.gif';
            expect(filterFileList(files as any, accept, true)).toEqual(files);
        });
        it('multiple == false', () => {
            const file1 = new File([], 'file1.png');
            const file2 = new File([], 'file2.png');
            const files = [file1, file2];
            const accept = '.png,.jpg,.gif';
            expect(filterFileList(files as any, accept, false)).toEqual([file1]);
        });
    });
    it('getFormData', () => {
        const file = new File([], 'file.png');
        const formData = getFormData([file]);
        expect(formData instanceof FormData).toEqual(true);
        expect(formData.has('file.png')).toEqual(true);
    });
});
