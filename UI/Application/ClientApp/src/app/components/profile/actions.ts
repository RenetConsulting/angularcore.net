import { FormGroup } from '@angular/forms';
import { Action } from '@ngrx/store';
import { IPerson } from '~/interfaces/person';
import { ProfileTypes } from './types';

export class UpdateProfileRequest implements Action {
    readonly type = ProfileTypes.UPDATE_PROFILE_REQUEST;
    constructor(readonly payload: FormGroup) { }
}
export class UpdateProfileSuccess implements Action {
    readonly type = ProfileTypes.UPDATE_PROFILE_SUCCESS;
    constructor(readonly payload: IPerson) { }
}
export class UpdateProfileError implements Action {
    readonly type = ProfileTypes.UPDATE_PROFILE_ERROR;
    constructor(readonly error) { }
}

export class GetProfileRequest implements Action {
    readonly type = ProfileTypes.GET_PROFILE_REQUEST;
    constructor() { }
}
export class GetProfileSuccess implements Action {
    readonly type = ProfileTypes.GET_PROFILE_SUCCESS;
    constructor(readonly success: IPerson) { }
}
export class GetProfileError implements Action {
    readonly type = ProfileTypes.GET_PROFILE_ERROR;
    constructor(readonly error) { }
}

export type ProfileUnion = UpdateProfileRequest | UpdateProfileSuccess | UpdateProfileError
    | GetProfileRequest | GetProfileSuccess | GetProfileError;