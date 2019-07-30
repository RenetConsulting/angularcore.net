import { MatDialogRef } from '@angular/material/dialog';
import { CloseDialogDirective } from './close-dialog.directive';

describe('CloseDialogDirective', () => {

    let directive: CloseDialogDirective;

    let event: MouseEvent;
    let target: Element;

    beforeEach(() => {

        target = { tagName: 'A' } as jasmine.SpyObj<Element>;
        event = { target: target as EventTarget } as MouseEvent;

        directive = new CloseDialogDirective(null, null, null);

        directive.dialogRef = jasmine.createSpyObj<MatDialogRef<null>>('MatDialogRef', ['close']);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
    it('onClick', () => {
        directive.onClick(event);
        expect(directive.dialogRef.close).toHaveBeenCalled();
    });
});
