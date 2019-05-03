export const checkFileTypes = (file: File, accept: string): boolean => {
    if (accept) {
        return accept.split(',').map(x => x.trim().toLowerCase()).some(type => {
            if (type.charAt(0) === '.') {
                return file.name.toLowerCase().endsWith(type);
            }
            /** case mime type */
            else if (/\/\*$/.test(type)) {
                return file.type.replace(/\/.*$/, '') === type.replace(/\/.*$/, '');
            }
            return file.type === type;
        });
    }
    return true;
};

export const filterFiles = (files: FileList | Array<File>, accept: string) =>
    Array.from(files).filter(x => checkFileTypes(x, accept));

export const filterFileList = (files: FileList, accept: string, multiple: boolean) =>
    multiple ? filterFiles(files, accept) : filterFiles([files[0]], accept);

export const getFormData = (files: Array<File> | FileList) => {
    const result = new FormData();
    Array.from(files).forEach(x => result.append(x.name, x));
    return result;
};
