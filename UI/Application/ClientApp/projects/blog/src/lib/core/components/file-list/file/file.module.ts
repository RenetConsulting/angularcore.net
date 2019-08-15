import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FileComponent } from './file.component';

@NgModule({
    declarations: [FileComponent],
    exports: [FileComponent],
    imports: [
        CommonModule,
        MatCardModule,
        MatTooltipModule,
        MatButtonModule
    ]
})
export class FileModule { }
