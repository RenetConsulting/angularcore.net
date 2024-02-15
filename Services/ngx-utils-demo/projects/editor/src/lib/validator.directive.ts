import { Directive, HostListener, Inject, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import { NgxValidatorDirective } from '@renet-consulting/ngx-validator/src/public-api';

@Directive({
    selector: '[validate][formControl]',
})
export class ValidatorDirective extends NgxValidatorDirective implements OnChanges, OnInit, OnDestroy {

    constructor(
        @Inject(NgControl) ngControl: NgControl
    ) {
        super(ngControl);
    }

    @HostListener('onBlur') onBlur = () => this.emitError();
}
