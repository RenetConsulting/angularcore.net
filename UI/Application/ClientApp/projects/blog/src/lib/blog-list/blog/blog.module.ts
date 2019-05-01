import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BlogComponent } from './blog.component';

@NgModule({
    declarations: [BlogComponent],
    exports: [BlogComponent],
    imports: [
        CommonModule,
        MatCardModule
    ]
})
export class BlogModule { }
