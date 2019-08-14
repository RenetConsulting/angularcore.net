import { TestBed } from '@angular/core/testing';
import { EditorService } from './editor.service';
import { ToolbarHandlersService } from './toolbar-handlers.service';

interface IToolbar {
    addHandler: () => void;
}

interface IQuill {
    getSelection: () => { index: number, length: number };
    getLength: () => number;
}

describe('EditorService', () => {

    let service: EditorService;

    let toolbar: jasmine.SpyObj<IToolbar>;
    let quill: jasmine.SpyObj<IQuill>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                EditorService,
                {
                    provide: ToolbarHandlersService,
                    useValue: jasmine.createSpyObj<ToolbarHandlersService>('ToolbarHandlersService', ['test'])
                },
            ]
        });

        service = TestBed.get(EditorService);
        toolbar = jasmine.createSpyObj<IToolbar>('IToolbar', ['addHandler']);
        quill = jasmine.createSpyObj<IQuill>('IQuill', ['getSelection', 'getLength']);
    });

    it('should create', () => {
        expect(service).toBeTruthy();
    });
    it('addToolbarHandlers', () => {
        service.addToolbarHandlers(toolbar, quill);
        expect(toolbar.addHandler).toHaveBeenCalled();
    });
});
