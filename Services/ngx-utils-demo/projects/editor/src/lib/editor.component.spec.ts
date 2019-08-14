import { AbstractControl, FormGroupDirective, NgControl, ValidationErrors } from '@angular/forms';
import { of } from 'rxjs';
import { EditorComponent } from './editor.component';
import { EditorService } from './editor.service';

interface IQuill {
    getModule(name: string): any;
}

describe('EditorComponent', () => {

    let component: EditorComponent;

    let ngControl: NgControl;
    let control: jasmine.SpyObj<AbstractControl>;
    let formGroup: FormGroupDirective;
    let editorService: jasmine.SpyObj<EditorService>;
    let quill: jasmine.SpyObj<IQuill>;

    beforeEach(() => {

        control = jasmine.createSpyObj<AbstractControl>('AbstractControl', [
            'setValidators',
            'markAsDirty',
            'markAsTouched',
            'updateValueAndValidity'
        ]);
        quill = jasmine.createSpyObj<IQuill>('Quill', ['getModule']);
        editorService = jasmine.createSpyObj<EditorService>('EditorService', ['addToolbarHandlers']);
        ngControl = { control } as Partial<NgControl> as NgControl;
        formGroup = { ngSubmit: of({}) } as FormGroupDirective;

        component = new EditorComponent(ngControl, formGroup, editorService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'updateControl');
        spyOn(component, 'setError');
        component.ngOnInit();
        expect(component.updateControl).toHaveBeenCalled();
        expect(control.setValidators).toHaveBeenCalled();
        expect(component.setError).toHaveBeenCalled();
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('updateControl', () => {
        component.updateControl();
        expect(control.markAsDirty).toHaveBeenCalled();
        expect(control.markAsTouched).toHaveBeenCalled();
        expect(control.updateValueAndValidity).toHaveBeenCalled();
    });
    it('onCreated', () => {
        quill.getModule.and.returnValue(null);
        component.onCreated(quill);
        expect(component.quill).toEqual(quill);
        expect(quill.getModule).toHaveBeenCalledWith('toolbar');
        expect(editorService.addToolbarHandlers).toHaveBeenCalledWith(null, quill);
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

    describe('mapMinLength', () => {

        it('should be null', () => {
            expect(component.mapMinLength({} as AbstractControl)).toBeNull();
        });
        it('should be error', () => {
            const minLength = 25;
            expect(component.mapMinLength({
                errors: { minLengthError: { minLength } } as ValidationErrors
            } as AbstractControl)).toEqual({ minlength: { requiredLength: minLength } });
        });
    });

    describe('mapMaxLength', () => {

        it('should be null', () => {
            expect(component.mapMaxLength({} as AbstractControl)).toBeNull();
        });
        it('should be error', () => {
            const maxLength = 25;
            expect(component.mapMaxLength({
                errors: { maxLengthError: { maxLength } } as ValidationErrors
            } as AbstractControl)).toEqual({ maxlength: { requiredLength: maxLength } });
        });
    });
});
