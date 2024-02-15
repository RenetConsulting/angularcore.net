import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Optional, Output, Self, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl, ValidationErrors } from '@angular/forms';
import { enterLeaveAnimation } from '@renet-consulting/animations/src/public-api';
import { ProvidedControlValueAccessorBaseDirective } from '@renet-consulting/control-value-accessor/src/public-api';
import { Subscription } from 'rxjs';
import { EditorService } from './editor.service';

@Component({
    // tslint:disable-next-line: component-selector
    selector: 'editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [EditorService],
    animations: [enterLeaveAnimation]
})
export class EditorComponent extends ProvidedControlValueAccessorBaseDirective implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() editable: boolean;
    @Input() required: boolean;
    @Input() minLength: number;
    @Input() maxLength: number;
    @Input() label: number;
    @Output() blur = new EventEmitter();
    readonly subscription = new Subscription();
    errorState: number;
    error: string;
    /** https://quilljs.com/docs/api/ */
    quill: any;

    constructor(
        @Optional() @Self() @Inject(NgControl) ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private formGroup: FormGroupDirective,
        @Inject(EditorService) private editorService: EditorService,
    ) {
        super(ngControl);
    }

    ngOnInit(): void {
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(this.updateControl));
        }
        if (this.ngControl) {
            this.ngControl.control.setValidators([this.ngControl.control.validator, this.mapMinLength, this.mapMaxLength]);
        }
        this.setError();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }

    onCreated = (quill: any): void => {
        this.quill = quill;
        this.editorService.addToolbarHandlers(quill.getModule('toolbar'), quill);
    }

    onBlur = (e) => this.blur.emit(e);

    setError = (e?: string): void => {
        this.error = e;
        this.errorState = e ? 1 : 0;
    }

    mapMinLength = (c: AbstractControl): ValidationErrors | null => {
        const errors = c.errors;
        const error = errors && errors.minLengthError;
        return error ? { minlength: { requiredLength: error.minLength } } : null;
    }

    mapMaxLength = (c: AbstractControl): ValidationErrors | null => {
        const errors = c.errors;
        const error = errors && errors.maxLengthError;
        return error ? { maxlength: { requiredLength: error.maxLength } } : null;
    }
}
