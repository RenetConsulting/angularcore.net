import { Validators } from '@angular/forms';
import { MAX_LENGTH_EMAIL } from './max.length.email';
import { MIN_LENGTH_EMAIL } from './min.length.email';

export const EMAIL_VALIDATORS = [
    Validators.required,
    Validators.email,
    Validators.minLength(MIN_LENGTH_EMAIL),
    Validators.maxLength(MAX_LENGTH_EMAIL)
];