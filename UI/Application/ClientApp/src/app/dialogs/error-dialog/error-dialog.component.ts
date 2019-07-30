import { Component, Injectable } from '@angular/core';
import { NgxErrorDialogComponent } from '@renet-consulting/ngx-messenger';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    styleUrls: ['./error-dialog.component.scss']
})
export class ErrorDialogComponent extends NgxErrorDialogComponent { }
