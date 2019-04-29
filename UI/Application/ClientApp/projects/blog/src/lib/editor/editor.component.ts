import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { errorEnterLeaveAnimation } from '@renet-consulting/ngx-mat-input';
import { QuillModules } from 'ngx-quill';
import { Subscription } from 'rxjs';
import { FileListComponent } from '../file-list/file-list.component';
import { mapMaxLength, mapMinLength } from './validators';

@Component({
    selector: 'lib-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [errorEnterLeaveAnimation]
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
    errorState: number;

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
        this.setError();
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    get selectionIndex() {
        const range = this.quill.getSelection();
        return range && range.index || this.quill.getLength();
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
        const index = this.selectionIndex;
        this.quill.insertEmbed(index, 'image', link);
        this.quill.insertText(index + 1, '\n', 'user');
        this.quill.setSelection(index + 2, 'silent');
    }

    setError = (e?: string): void => {
        this.error = e;
        this.errorState = this.error ? 1 : 0;
    }
}