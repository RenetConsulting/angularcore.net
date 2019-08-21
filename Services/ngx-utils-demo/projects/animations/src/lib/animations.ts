import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const ERROR_START = { opacity: 0, width: '0px', height: '0px' };
const ERROR_END = { opacity: 1, width: '*', height: '*' };

/**
 * about duration read at https://material.io/design/motion/speed.html#duration
 * about easing read at https://material.io/design/motion/speed.html#easing
 */
export const enterLeaveAnimation = trigger('enterLeave', [
    transition(':enter, * => void', []),
    transition(':increment', [
        query(':enter', [
            style(ERROR_START),
            stagger(180, [
                animate('300ms ease-out', style(ERROR_END)),
            ]),
        ], { optional: true })
    ]),
    transition(':decrement', [
        query(':leave', [
            stagger(100, [
                animate('160ms ease-in', style(ERROR_START)),
            ]),
        ], { optional: true })
    ]),
]);
