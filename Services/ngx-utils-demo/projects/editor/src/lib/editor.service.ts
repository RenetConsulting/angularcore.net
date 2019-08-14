import { Inject, Injectable, Optional } from '@angular/core';
import { ToolbarHandlersService } from './toolbar-handlers.service';

@Injectable()
export class EditorService {

    constructor(
        @Inject(ToolbarHandlersService) @Optional() private toolbarHandlers: ToolbarHandlersService
    ) { }

    /** https://quilljs.com/docs/modules/toolbar/#handlers */
    addToolbarHandlers = (toolbar: any, quill: any): void => {
        const handlers = this.toolbarHandlers;
        if (toolbar && handlers) {
            Object.keys(handlers)
                .filter(key => typeof handlers[key] === 'function')
                .forEach(key => toolbar.addHandler(key, () => handlers[key](quill)));
        }
    }
}
