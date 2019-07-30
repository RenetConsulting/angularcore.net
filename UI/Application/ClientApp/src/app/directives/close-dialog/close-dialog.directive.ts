import { Directive, HostListener } from '@angular/core';
import { MatDialogClose } from '@angular/material/dialog';

@Directive({
    selector: '[closeDialog]'
})
export class CloseDialogDirective extends MatDialogClose {

    @HostListener('click', ['$event']) onClick = (e): void => {
        if (e && e.target && e.target.tagName === 'A') {
            this.dialogRef.close();
        }
    }
}
