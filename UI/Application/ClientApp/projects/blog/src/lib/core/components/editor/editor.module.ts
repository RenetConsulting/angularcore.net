import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { EditorModule as NgxEditorModule, ToolbarHandlersService as NgxToolbarHandlersService } from '@renet-consulting/editor';
import { FileListModule } from '../file-list/file-list.module';
import { ToolbarHandlersService } from './toolbar-handlers.service';

@NgModule({
    exports: [NgxEditorModule],
    providers: [{ provide: NgxToolbarHandlersService, useClass: ToolbarHandlersService, deps: [MatDialog] }],
    imports: [
        CommonModule,
        MatDialogModule,
        NgxEditorModule,
        FileListModule,
    ]
})
export class EditorModule { }
