import { EventEmitter, Directive } from '@angular/core';
import { NgxUploaderBaseDirective } from './ngx-uploader.base';

@Directive()
export class TestBase extends NgxUploaderBaseDirective {

    emitter;
}

describe('NgxUploaderBaseDirective', () => {

    let base: NgxUploaderBaseDirective;

    const files: any = [new File([], 'file1.png')];

    beforeEach(() => {
        base = new TestBase();
    });

    it('emit', () => {
        base.accept = '.png';
        base.emitter = jasmine.createSpyObj<EventEmitter<any>>('EventEmitter', ['emit']);
        base.emit(files);
        expect(base.emitter.emit).toHaveBeenCalledWith(files);
    });
});
