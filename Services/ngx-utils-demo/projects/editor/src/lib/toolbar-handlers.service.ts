import { Injectable } from '@angular/core';

@Injectable()
export class ToolbarHandlersService {

    [key: string]: (quill: any) => void;

    constructor() { }
}
