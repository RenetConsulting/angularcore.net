import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxMessengerModule, NgxErrorDialogComponent } from 'projects/ngx-messenger/src/public-api';
import { CustomErrorDialogModule } from './custom-error-dialog/custom-error-dialog.module';
import { MessagerRoutingModule } from './messenger-routing.module';
import { MessagerComponent } from './messenger.component';
import { CustomErrorDialogComponent } from './custom-error-dialog/custom-error-dialog.component';

@NgModule({
    declarations: [MessagerComponent],
    providers: [{ provide: NgxErrorDialogComponent, useClass: CustomErrorDialogComponent }],
    imports: [
        CommonModule,
        MessagerRoutingModule,
        NgxMessengerModule,
        CustomErrorDialogModule
    ]
})
export class MessagerModule { }
