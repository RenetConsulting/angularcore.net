import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMessengerModule } from 'projects/ngx-messenger/src/public-api';
import { MessagerRoutingModule } from './messenger-routing.module';
import { MessagerComponent } from './messenger.component';

@NgModule({
    declarations: [MessagerComponent],
    imports: [
        CommonModule,
        MessagerRoutingModule,
        NgxMessengerModule,
    ]
})
export class MessagerModule { }
