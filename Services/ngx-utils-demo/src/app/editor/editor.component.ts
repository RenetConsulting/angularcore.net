import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, Validators } from '@angular/forms';
import { ToolbarHandlersService } from 'projects/editor/src/public-api';

export function imageValue(quill) {
    return console.log(quill.getSelection());
}

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    providers: [{ provide: ToolbarHandlersService, useValue: ({ image: imageValue }) }],
})
export class EditorComponent implements OnInit {

    control = new UntypedFormControl('123', [Validators.required]);

    constructor() { }

    ngOnInit() {
    }

}
