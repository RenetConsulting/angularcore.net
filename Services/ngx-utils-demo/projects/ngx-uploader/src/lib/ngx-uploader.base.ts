import { EventEmitter, Input } from '@angular/core';
import { filterFileList } from './utils';

export abstract class NgxUploaderBase {

    @Input() accept: string;
    @Input() multiple: boolean;
    abstract emitter: EventEmitter<Array<File>>;

    constructor() { }

    emit = (fileList: FileList): void => {
        const files = filterFileList(fileList, this.accept, this.multiple);
        if (files.length) {
            this.emitter.emit(files);
        }
    }
}
