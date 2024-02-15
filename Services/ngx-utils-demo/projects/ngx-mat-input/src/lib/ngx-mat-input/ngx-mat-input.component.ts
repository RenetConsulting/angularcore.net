import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, Renderer2, Self, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormGroupDirective, NgControl } from '@angular/forms';
import { enterLeaveAnimation } from '@renet-consulting/animations';
import { InputBaseDirective } from '../input.base';

@Component({
    // tslint:disable-next-line
    selector: 'ngx-mat-input',
    templateUrl: './ngx-mat-input.component.html',
    styleUrls: ['./ngx-mat-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [enterLeaveAnimation]
})
export class NgxMatInputComponent extends InputBaseDirective implements ControlValueAccessor, OnChanges, OnInit, OnDestroy {

    @Input() autocomplete = 'off';
    @Input() name: string;
    @Input() type = 'text';

    constructor(
        @Inject(Renderer2) private renderer: Renderer2,
        @Optional() @Self() @Inject(NgControl) control: NgControl,
        @Optional() @Inject(FormGroupDirective) formGroup: FormGroupDirective,
    ) {
        super(control, formGroup);
    }

    ngOnChanges(e): void {
        super.ngOnChanges(e);
        if (e.name) {
            this.toggleAttribute();
        }
    }

    ngOnInit(): void {
        super.ngOnInit();
        this.toggleAttribute();
    }

    toggleAttribute = (): void => {
        const el = this.inputRef && this.inputRef.nativeElement;
        if (el) {
            const name = 'name';
            this.name ? this.renderer.setAttribute(el, name, this.name) : this.renderer.removeAttribute(el, name);
        }
    }
}
