import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { NGX_SNACK_BAR_CONFIG } from '@renet-consulting/ngx-messenger';
import { MessageComponent } from './message.component';

@NgModule({
    declarations: [MessageComponent],
    exports: [MessageComponent],
    entryComponents: [MessageComponent],
    providers: [
        { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useExisting: NGX_SNACK_BAR_CONFIG },
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatSnackBarModule
    ]
})
export class MessageModule { }
