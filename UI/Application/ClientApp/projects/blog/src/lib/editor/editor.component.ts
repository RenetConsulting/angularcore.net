import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { QuillModules } from 'ngx-quill';
import { Subscription } from 'rxjs';
import { FileListComponent } from '../file-list/file-list.component';
import { mapMaxLength, mapMinLength } from './validators';

@Component({
    selector: 'lib-editor',
    templateUrl: './editor.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorComponent implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {

    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() minLength: number;
    @Input() maxLength: number;
    @Input() label: number;
    readonly subscription = new Subscription();
    disabled: boolean;
    onChange: (i) => void;
    onTouched: () => void;
    value;
    modules: QuillModules;
    private quill;
    error: string;

    constructor(
        @Self() @Inject(NgControl) public ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private formGroup: FormGroupDirective,
        @Inject(MatDialog) private dialog: MatDialog,
    ) {
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    ngOnChanges(e): void {
        if (e.readonly) {
            this.setModules();
        }
    }

    ngOnInit(): void {
        if (this.formGroup) {
            this.subscription.add(this.formGroup.ngSubmit.subscribe(this.updateControl));
        }
        if (this.ngControl) {
            this.ngControl.control.setValidators([this.ngControl.control.validator, mapMinLength, mapMaxLength]);
        }
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    /** internal */
    writeValue(value): void {
        this.value = value;
        if (this.onChange) {
            this.onChange(value);
        }
    }

    /** internal */
    registerOnChange(fn): void {
        this.onChange = fn;
    }

    /** internal */
    registerOnTouched(fn): void {
        this.onTouched = fn;
    }

    /** internal */
    setDisabledState(value: boolean): void {
        this.disabled = value;
    }

    /** internal */
    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }

    /** internal */
    setModules = (): void => {
        this.modules = this.readonly ? { toolbar: false } : null;
    }

    onEditorCreated = (quill): void => {
        this.quill = quill;
        const toolbar = quill.getModule('toolbar');
        if (toolbar) {
            toolbar.addHandler('image', this.openDialog);
        }
    }

    openDialog = (): void => {
        const ref = this.dialog.open(FileListComponent);
        ref.componentInstance.insertImage = (x): void => {
            this.insertImage(x);
            ref.close();
        };
    }

    insertImage = (link: string): void => {
        const range = this.quill.getSelection();
        const index = range && range.index || this.quill.getLength();
        this.quill.insertEmbed(index, 'image', link);
    }

    setError = (e): void => {
        this.error = e;
    }
}