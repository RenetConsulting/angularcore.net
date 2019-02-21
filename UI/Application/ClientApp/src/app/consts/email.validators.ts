import { Validators } from '@angular/forms';
import { MaxLength } from '../enums/max-length.type';
import { MinLength } from '../enums/min-length.type';

export const EMAIL_VALIDATORS = [
    Validators.required,
    Validators.email,
    Validators.minLength(MinLength.l6),
    Validators.maxLength(MaxLength.l68)
];