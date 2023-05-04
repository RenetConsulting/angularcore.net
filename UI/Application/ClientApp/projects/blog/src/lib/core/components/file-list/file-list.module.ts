import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NgxUploaderModule } from '@renet-consulting/ngx-uploader';
import { ResizeModule } from '@renet-consulting/resize';
import { ViewportChangeModule } from '@renet-consulting/viewport-change';
import { NgxVirtualSwiperModule } from 'ngx-virtual-swiper';
import { PromptDialogModule } from '../prompt-dialog/prompt-dialog.module';
import { FileEffects } from './effects';
import { FileListComponent } from './file-list.component';
import { FileModule } from './file/file.module';
import { fileReducer } from './reducer';

@NgModule({
    declarations: [FileListComponent],
    exports: [FileListComponent],
    imports: [
        CommonModule,
        MatDialogModule,
        MatButtonModule,
        NgxVirtualSwiperModule,
        StoreModule.forFeature('file', fileReducer),
        EffectsModule.forFeature([FileEffects]),
        ScrollingModule,
        NgxUploaderModule,
        FileModule,
        ResizeModule,
        ViewportChangeModule,
        PromptDialogModule
    ]
})
export class FileListModule { }
