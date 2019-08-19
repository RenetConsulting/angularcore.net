import { Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs/operators';
import { FileListComponent } from '../file-list/file-list.component';

@Injectable()
export class ToolbarHandlersService {

    constructor(
        @Inject(MatDialog) private dialog: MatDialog
    ) { }

    image = (quill: any): void => {
        const range = quill.getSelection();
        const ref = this.dialog.open(FileListComponent);
        ref.afterClosed().pipe(filter(x => !!x)).subscribe((link: string) => {
            quill.deleteText(range.index, range.length);
            quill.insertEmbed(range.index, 'image', link);
            quill.insertText(range.index + 1, '\n', 'user');
            quill.setSelection(range.index + 2, 'silent');
        });
    }
}
