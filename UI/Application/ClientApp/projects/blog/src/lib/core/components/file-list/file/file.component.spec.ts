import { EventEmitter } from '@angular/core';
import { FileComponent } from './file.component';

describe('FileComponent', () => {

    let component: FileComponent;

    beforeEach(() => {
        component = new FileComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('delete', () => {
        expect(component.delete instanceof EventEmitter).toEqual(true);
    });
    it('select', () => {
        expect(component.select instanceof EventEmitter).toEqual(true);
    });
    it('onDelete', () => {
        spyOn(component.delete, 'emit');
        component.onDelete();
        expect(component.delete.emit).toHaveBeenCalledWith(component.item);
    });
    it('onSelect', () => {
        spyOn(component.select, 'emit');
        component.onSelect();
        expect(component.select.emit).toHaveBeenCalledWith(component.item);
    });
});
