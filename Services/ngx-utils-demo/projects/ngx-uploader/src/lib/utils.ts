import { FileError, FileOption } from './models';

export function emitOpload(files: FileList, accept: string, multiple: boolean, option: FileOption): File | File[] | FileError {
    if (multiple) {
        return checkAllFile(files, accept, option);
    }
    else {
        if (files.length === 1) {
            return checkAllFile(files[0], accept, option);
        }
        return FileError.NumError;
    }
}

export function checkAllFile(file: File | FileList, accept: string, option: FileOption): File | File[] | FileError {
    if (file instanceof FileList) {
        const files: File[] = [];
        let err: FileError;
        const allPass = Array.from(file).every((f) => {
            err = null;
            if (!checkFileTypes(f, accept)) {
                err = FileError.TypeError;
            }
            if (!err) {
                files.push(f);
            }
            return option.skipInvalid || (err === null);
        });
        if (!allPass) {
            return err;
        }
        return files;
    }
    else {
        if (!checkFileTypes(file, accept)) {
            return FileError.TypeError;
        }
        return file;
    }
}

export function checkFileTypes(file: File, accept: string): boolean {
    if (accept) {
        const acceptedFilesArray = accept.split(',');
        return acceptedFilesArray.some(type => {
            const validType = type.trim();
            if (validType.charAt(0) === '.') {
                return file.name.toLowerCase().endsWith(validType.toLowerCase());
            }
            else if (/\/\*$/.test(validType)) {
                // This is something like a image/* mime type
                return file.type.replace(/\/.*$/, '') === validType.replace(/\/.*$/, '');
            }
            return file.type === validType;
        });
    }
    return true;
}
