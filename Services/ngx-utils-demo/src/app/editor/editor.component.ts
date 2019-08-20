import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToolbarHandlersService } from 'projects/editor/src/public-api';

@Component({
    selector: 'app-editor',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss'],
    providers: [{ provide: ToolbarHandlersService, useValue: ({ image: (quill) => console.log(quill.getSelection()) }) }],
})
export class EditorComponent implements OnInit {

    control = new FormControl('123', [Validators.required]);

    constructor() { }

    ngOnInit() {
    }

}
