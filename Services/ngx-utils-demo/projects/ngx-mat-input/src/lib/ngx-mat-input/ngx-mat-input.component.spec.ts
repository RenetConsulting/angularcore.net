import { NgxMatInputComponent } from './ngx-mat-input.component';

describe('NgxMatInputComponent', () => {

    let component: NgxMatInputComponent;

    beforeEach(() => {
        component = new NgxMatInputComponent(null, null);
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
});
