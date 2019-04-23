import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxUploaderModule } from '@renet-consulting/ngx-uploader';
import { FileEffects } from './effects';
import { FileListComponent } from './file-list.component';
import { FileModule } from './file/file.module';
import { fileReducer } from './reducer';

@NgModule({
    declarations: [FileListComponent],
    exports: [FileListComponent],
    entryComponents: [FileListComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        StoreModule.forFeature('file', fileReducer),
        EffectsModule.forFeature([FileEffects]),
        FileModule,
        NgxUploaderModule
    ]
})
export class FileListModule { }
