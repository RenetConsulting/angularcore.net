import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BypassModule } from '@renet-consulting/bypass';
import { BlogComponent } from './blog.component';

@NgModule({
    declarations: [BlogComponent],
    exports: [BlogComponent],
    imports: [
        CommonModule,
        MatCardModule,
        BypassModule,
        MatButtonModule
    ]
})
export class BlogModule { }
