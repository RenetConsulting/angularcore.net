import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { RouteTransformerModule } from '~/directives/route-transformer/route-transformer.module';
import { ErrorDialogComponent } from './error-dialog.component';

@NgModule({
    declarations: [ErrorDialogComponent],
    exports: [ErrorDialogComponent],
    entryComponents: [ErrorDialogComponent],
    imports: [
        CommonModule,
        RouteTransformerModule,
        MatDialogModule,
        MatButtonModule,
    ]
})
export class ErrorDialogModule { }
