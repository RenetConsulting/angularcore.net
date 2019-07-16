import { AbstractControl, FormGroupDirective, NgControl } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { of } from 'rxjs';
import { FileListComponent } from '../file-list/file-list.component';
import { EditorComponent } from './editor.component';

interface IQuill {
    getSelection(): any;
    getLength(): number;
    getModule(name: string): any;
    insertEmbed(index: number, type: string, value: any, source?: any): any;
    insertText(index: number, text: string, source?: any): any;
    setSelection(index: number, length: number, source?: any): void;
}

describe('EditorComponent', () => {

    let component: EditorComponent;

    let ngControl: NgControl;
    let control: jasmine.SpyObj<AbstractControl>;
    let formGroup: FormGroupDirective;
    let dialog: jasmine.SpyObj<MatDialog>;
    let quill: jasmine.SpyObj<IQuill>;

    beforeEach(() => {
        control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
            'setValidators',
            'markAsDirty',
            'markAsTouched',
            'updateValueAndValidity'
        ]);
        quill = jasmine.createSpyObj<IQuill>('Quill', [
            'getSelection',
            'getLength',
            'getModule',
            'insertEmbed',
            'insertText',
            'setSelection',
        ]);
        dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open']);
        ngControl = { control } as Partial<NgControl> as NgControl;
        formGroup = { ngSubmit: of({}) } as FormGroupDirective;

        component = new EditorComponent(ngControl, formGroup, dialog);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnChanges', () => {
        spyOn(component, 'setModules');
        component.ngOnChanges({ readonly: {} });
        expect(component.setModules).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(component, 'updateControl');
        spyOn(component, 'setError');
        component.ngOnInit();
        expect(component.updateControl).toHaveBeenCalled();
        expect(control.setValidators).toHaveBeenCalled();
        expect(component.setError).toHaveBeenCalled();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('selectionIndex', () => {
        const index = 65;
        quill.getSelection.and.returnValue({});
        quill.getLength.and.returnValue(index);
        component.quill = quill;
        expect(component.getSelectionIndex()).toEqual(index);
    });
    it('updateControl', () => {
        component.updateControl();
        expect(control.markAsDirty).toHaveBeenCalled();
        expect(control.markAsTouched).toHaveBeenCalled();
        expect(control.updateValueAndValidity).toHaveBeenCalled();
    });

    describe('setModules', () => {

        it('readonly is undefined', () => {
            component.setModules();
            expect(component.modules).toBeNull();
        });
        it('readonly is true', () => {
            component.readonly = true;
            component.setModules();
            expect(component.modules).toEqual({ toolbar: false });
        });
    });

    it('onEditorCreated', () => {
        const toolbar = jasmine.createSpyObj<{ addHandler: () => any }>('Toolbar', ['addHandler']);
        quill.getModule.and.returnValue(toolbar);

        component.onEditorCreated(quill);

        expect(component.quill).toEqual(quill);
        expect(quill.getModule).toHaveBeenCalledWith('toolbar');
        expect(toolbar.addHandler).toHaveBeenCalledWith('image', component.openDialog);
    });

    it('openDialog', () => {
        spyOn(component, 'insertImage');
        const link = 'https://bob.png';
        const dialogRef = jasmine.createSpyObj<MatDialogRef<FileListComponent, string>>('', ['afterClosed']);
        dialogRef.afterClosed.and.returnValue(of(link));
        dialog.open.and.returnValue(dialogRef);

        component.openDialog();

        expect(dialog.open).toHaveBeenCalledWith(FileListComponent);
        expect(dialogRef.afterClosed).toHaveBeenCalled();
        expect(component.insertImage).toHaveBeenCalledWith(link);
    });
    it('insertImage', () => {
        const link = 'https://bob.png';
        const index = 24;
        spyOn(component, 'getSelectionIndex').and.returnValue(index);
        component.quill = quill;

        component.insertImage(link);

        expect(quill.insertEmbed).toHaveBeenCalledWith(index, 'image', link);
        expect(quill.insertText).toHaveBeenCalledWith(index + 1, '\n', 'user');
        expect(quill.setSelection).toHaveBeenCalledWith(index + 2, 'silent');
    });

    describe('setError', () => {

        it('errorState === 1', () => {
            const error = 'bob';
            component.setError(error);
            expect(component.error).toEqual(error);
            expect(component.errorState).toEqual(1);
        });
        it('errorState === 0', () => {
            const error = null;
            component.setError(error);
            expect(component.error).toEqual(error);
            expect(component.errorState).toEqual(0);
        });
    });
});
