import { Action } from '@ngrx/store';
import { RootTypes } from '~/types/root.types';

export class Reset implements Action {
    readonly type = RootTypes.RESET;
    constructor() { }
}

export type RootUnion = Reset;