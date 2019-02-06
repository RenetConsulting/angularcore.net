import { Validators } from '@angular/forms';
import { MAX_LENGTH_PASSWORD } from './max.length.password';
import { MIN_LENGTH_EMAIL } from './min.length.email';

export const PASSWORD_VALIDATORS = [
    Validators.required,
    Validators.minLength(MIN_LENGTH_EMAIL),
    Validators.maxLength(MAX_LENGTH_PASSWORD)
];