import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditorModule as _EditorModule, ToolbarHandlersService as _ToolbarHandlersService } from '@renet-consulting/editor';
import { FileListModule } from '../file-list/file-list.module';
import { ToolbarHandlersService } from './toolbar-handlers.service';

@NgModule({
    exports: [_EditorModule],
    providers: [{ provide: _ToolbarHandlersService, useClass: ToolbarHandlersService, deps: [MatDialog] }],
    imports: [
        CommonModule,
        MatDialogModule,
        _EditorModule,
        FileListModule,
    ]
})
export class EditorModule { }
