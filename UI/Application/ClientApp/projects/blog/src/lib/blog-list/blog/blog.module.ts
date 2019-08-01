import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { BypassModule } from '@renet-consulting/bypass';
import { ResizeModule } from '@renet-consulting/resize';
import { BlogComponent } from './blog.component';

@NgModule({
    declarations: [BlogComponent],
    exports: [BlogComponent],
    imports: [
        CommonModule,
        RouterModule,
        MatCardModule,
        BypassModule,
        MatButtonModule,
        ResizeModule,
    ]
})
export class BlogModule { }
