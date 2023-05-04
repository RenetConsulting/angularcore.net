import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouteTransformerModule } from '~/directives/route-transformer/route-transformer.module';
import { ErrorDialogComponent } from './error-dialog.component';
import { CloseDialogModule } from '~/directives/close-dialog/close-dialog.module';

@NgModule({
    declarations: [ErrorDialogComponent],
    exports: [ErrorDialogComponent],
    imports: [
        CommonModule,
        RouteTransformerModule,
        CloseDialogModule,
        MatDialogModule,
        MatButtonModule,
    ]
})
export class ErrorDialogModule { }
