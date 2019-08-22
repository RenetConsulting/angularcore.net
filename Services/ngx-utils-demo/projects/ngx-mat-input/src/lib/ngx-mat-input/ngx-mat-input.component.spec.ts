import { EventEmitter, Renderer2 } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { NgxMatInputComponent } from './ngx-mat-input.component';

describe('NgxMatInputComponent', () => {

    let component: NgxMatInputComponent;

    let formGroup: FormGroupDirective;
    let renderer: jasmine.SpyObj<Renderer2>;

    beforeEach(() => {

        renderer = jasmine.createSpyObj<Renderer2>('Renderer2', ['setAttribute', 'removeAttribute']);

        component = new NgxMatInputComponent(renderer, null, null);

        formGroup = {} as FormGroupDirective;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('autocomplete', () => {
        expect(component.autocomplete).toEqual('off');
    });
    it('type', () => {
        expect(component.type).toEqual('text');
    });
    it('ngOnChanges', () => {
        spyOn(component, 'setErrorsState');
        spyOn(component, 'setHintState');
        spyOn(component, 'setRequired');
        spyOn(component, 'setMaxlength');
        spyOn(component, 'toggleAttribute');
        component.ngOnChanges({ errors: {}, name: {} });
        expect(component.setErrorsState).toHaveBeenCalled();
        expect(component.setHintState).toHaveBeenCalled();
        expect(component.setRequired).toHaveBeenCalled();
        expect(component.setMaxlength).toHaveBeenCalled();
        expect(component.toggleAttribute).toHaveBeenCalled();
    });
    it('ngOnInit', () => {
        spyOn(component, 'setError');
        spyOn(component, 'toggleAttribute');
        formGroup.ngSubmit = jasmine.createSpyObj<EventEmitter<any>>('EventEmitter', ['subscribe']);
        component.ngOnInit();
        expect(component.setError).toHaveBeenCalledWith(null);
        expect(component.toggleAttribute).toHaveBeenCalled();
        component.ngOnDestroy();
    });
});
