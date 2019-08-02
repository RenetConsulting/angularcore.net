import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ControlValueAccessorBase, errorEnterLeaveAnimation } from '@renet-consulting/ngx-mat-input';
import { defaultModules, QuillModules } from 'ngx-quill';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { FileListComponent } from '../file-list/file-list.component';
import { mapMaxLength, mapMinLength } from './validators';

@Component({
    selector: 'lib-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: [errorEnterLeaveAnimation]
})
export class EditorComponent extends ControlValueAccessorBase implements OnChanges, OnInit, OnDestroy, ControlValueAccessor {

    @Input() placeholder: string;
    @Input() readonly: boolean;
    @Input() required: boolean;
    @Input() minLength: number;
    @Input() maxLength: number;
    @Input() label: number;
    @Input() defaultModules: QuillModules = defaultModules;
    readonly subscription = new Subscription();
    modules: QuillModules;
    quill;
    error: string;
    errorState: number;

    constructor(
        @Self() @Inject(NgControl) ngControl: NgControl,
        @Optional() @Inject(FormGroupDirective) private formGroup: FormGroupDirective,
        @Inject(MatDialog) private dialog: MatDialog,
    ) {
        super(ngControl);
    }

    ngOnChanges(): void {
        this.setModules();
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

    getSelectionIndex = (): number => {
        const range = this.quill.getSelection();
        return range && range.index || this.quill.getLength();
    }

    updateControl = (): void => {
        this.ngControl.control.markAsDirty();
        this.ngControl.control.markAsTouched();
        this.ngControl.control.updateValueAndValidity();
    }

    setModules = (): void => {
        console.log(this.defaultModules)
        this.modules = this.readonly ? { toolbar: false } : this.defaultModules;
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
        ref.afterClosed().pipe(filter(x => !!x)).subscribe((x: string) => this.insertImage(x));
    }

    insertImage = (link: string): void => {
        const index = this.getSelectionIndex();
        this.quill.insertEmbed(index, 'image', link);
        this.quill.insertText(index + 1, '\n', 'user');
        this.quill.setSelection(index + 2, 'silent');
    }

    setError = (e?: string): void => {
        this.error = e;
        this.errorState = this.error ? 1 : 0;
    }
}
