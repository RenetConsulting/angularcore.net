import { NgxMatTextareaComponent } from './ngx-mat-textarea.component';

describe('NgxMatTextareaComponent', () => {

    let component: NgxMatTextareaComponent;

    beforeEach(() => {
        component = new NgxMatTextareaComponent(null, null, 7, 15);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('minRows', () => {
        expect(component.minRows).toEqual(7);
    });
    it('maxRows', () => {
        expect(component.maxRows).toEqual(15);
    });
});
