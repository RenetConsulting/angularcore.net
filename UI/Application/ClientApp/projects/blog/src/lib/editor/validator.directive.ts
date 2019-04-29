import { Directive, EventEmitter, HostListener, Inject, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgxValidatorDirective } from '@renet-consulting/ngx-validator';

@Directive({
    // tslint:disable-next-line
    selector: '[lib-validate][formControlName], [lib-validate][formControl]',
})
export class ValidatorDirective extends NgxValidatorDirective implements OnChanges, OnInit, OnDestroy {

    /** overrided */
    // tslint:disable-next-line
    @Output('lib-validate') readonly validate = new EventEmitter<string | null>();

    constructor(
        @Inject(NgControl) ngControl: NgControl
    ) {
        super(ngControl);
    }

    /** overrided */
    /** internal */
    @HostListener('onBlur') blur = (): void => this.emitError();
}
