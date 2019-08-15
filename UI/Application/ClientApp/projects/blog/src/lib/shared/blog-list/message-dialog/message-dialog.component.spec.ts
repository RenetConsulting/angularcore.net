import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageDialogComponent } from './message-dialog.component';

describe('MessageDialogComponent', () => {

    let component: MessageDialogComponent;

    let snackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['dismiss']) }
            ]
        });

        snackBar = TestBed.get(MatSnackBar);

        component = new MessageDialogComponent(snackBar);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('setContent', () => {
        spyOn(component.content, 'next');
        const content = 'bob';
        component.setContent(content);
        expect(component.content.next).toHaveBeenCalledWith(content);
    });
    it('success', () => {
        spyOn(component.change, 'emit');
        component.success();
        expect(component.change.emit).toHaveBeenCalledWith(true);
        expect(component.change.emit).toHaveBeenCalledBefore(snackBar.dismiss);
        expect(snackBar.dismiss).toHaveBeenCalled();
    });
    it('close', () => {
        spyOn(component.change, 'emit');
        component.close();
        expect(component.change.emit).toHaveBeenCalledWith(false);
        expect(component.change.emit).toHaveBeenCalledBefore(snackBar.dismiss);
        expect(snackBar.dismiss).toHaveBeenCalled();
    });
});
