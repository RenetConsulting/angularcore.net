import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditorModule, ToolbarHandlersService } from '@renet-consulting/editor';
import { FileListModule } from '../file-list/file-list.module';
import { EditorToolbarHandlersService } from './editor-toolbar-handlers.service';

@NgModule({
    exports: [EditorModule],
    providers: [{ provide: ToolbarHandlersService, useClass: EditorToolbarHandlersService, deps: [MatDialog] }],
    imports: [
        CommonModule,
        MatDialogModule,
        EditorModule,
        FileListModule
    ]
})
export class EditorToolbarModule { }
