import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMessagerModule } from 'projects/ngx-messager/src/public-api';
import { MessagerRoutingModule } from './messager-routing.module';
import { MessagerComponent } from './messager.component';

@NgModule({
    declarations: [MessagerComponent],
    imports: [
        CommonModule,
        MessagerRoutingModule,
        NgxMessagerModule,
    ]
})
export class MessagerModule { }
