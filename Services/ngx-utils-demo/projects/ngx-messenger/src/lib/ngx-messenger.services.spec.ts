import { TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NgxMessengerService } from './ngx-messenger.service';
import { NGX_DIALOG_CONFIG, NGX_SNACK_BAR_CONFIG } from './tokens';

describe('NgxMessengerService', () => {

    let service: NgxMessengerService;

    let snackBarConfig: MatSnackBarConfig;
    let dialogConfig: MatDialogConfig;
    let snackBar: jasmine.SpyObj<MatSnackBar>;
    let dialog: jasmine.SpyObj<MatDialog>;
    let errorDialog: jasmine.SpyObj<NgxErrorDialogComponent>;

    beforeEach(() => {

        snackBar = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
        dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        errorDialog = jasmine.createSpyObj<NgxErrorDialogComponent>('NgxErrorDialogComponent', ['setError']);

        TestBed.configureTestingModule({
            providers: [
                { provide: MatSnackBar, useValue: snackBar },
                { provide: MatDialog, useValue: dialog },
            ]
        });

        snackBarConfig = TestBed.get(NGX_SNACK_BAR_CONFIG);
        dialogConfig = TestBed.get(NGX_DIALOG_CONFIG);
        service = TestBed.get(NgxMessengerService);
    });

    it('toBeDefined', () => {
        expect(service).toBeDefined();
    });

    describe('error', () => {

        it('should open NgxErrorDialogComponent', () => {
            const error = 'bob';
            const ref = { componentInstance: errorDialog } as MatDialogRef<any>;
            dialog.open.and.returnValue(ref);
            service.error(error);
            expect(dialog.open).toHaveBeenCalledWith(NgxErrorDialogComponent, dialogConfig);
            expect(errorDialog.setError).toHaveBeenCalled();
        });
        it('should open component', () => {
            const component: any = () => { };
            const ref = {} as MatDialogRef<any>;
            dialog.open.and.returnValue(ref);
            service.error(component);
            expect(dialog.open).toHaveBeenCalledWith(component, dialogConfig);
        });
    });

    it('success', () => {
        const success = 'bob';
        service.success(success);
        expect(snackBar.open).toHaveBeenCalledWith(success, 'Close', snackBarConfig);
    });
});
