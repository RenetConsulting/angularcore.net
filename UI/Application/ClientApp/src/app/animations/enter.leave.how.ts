import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const initStyle = {
    opacity: 0,
    width: '0px',
    height: '0px'
};

/**
 * about duration read at https://material.io/design/motion/speed.html#duration
 * about easing read at https://material.io/design/motion/speed.html#easing
 */
export const enterLeaveHOW = trigger('enterLeaveHOW', [
    transition(':enter, * => void', []),
    transition(':increment', [
        query(':enter', [
            style(initStyle),
            stagger(180, [
                animate('300ms ease-out', style({
                    opacity: 1,
                    width: '*',
                    height: '*'
                })),
            ]),
        ], { optional: true })
    ]),
    transition(':decrement', [
        query(':leave', [
            stagger(150, [
                animate('250ms ease-in', style(initStyle)),
            ]),
        ], { optional: true })
    ]),
]);