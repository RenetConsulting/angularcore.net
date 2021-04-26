import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable()
export class HandlerService {

    constructor() {
        console.log(this, new Date());
    }

    handle = (x, y) => {
        console.log(x, y);
        return of(x);
    }
}
