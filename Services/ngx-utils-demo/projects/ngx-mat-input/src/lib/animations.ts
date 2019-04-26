import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

interface StyleType { [key: string]: string | number; }

const ERROR_START = { opacity: 0, width: '0px', height: '0px' };
const ERROR_END = { opacity: 1, width: '*', height: '*' };

const HINT_START = { opacity: 0, height: '0px' };
const HINT_END = { opacity: 1, height: '*' };

/**
 * about duration read at https://material.io/design/motion/speed.html#duration
 * about easing read at https://material.io/design/motion/speed.html#easing
 */
export function enterLeaveAnimationFactory(name: string, start: StyleType, end: StyleType) {
    return trigger(name, [
        transition(':enter, * => void', []),
        transition(':increment', [
            query(':enter', [
                style(start),
                stagger(180, [
                    animate('300ms ease-out', style(end)),
                ]),
            ], { optional: true })
        ]),
        transition(':decrement', [
            query(':leave', [
                stagger(100, [
                    animate('160ms ease-in', style(start)),
                ]),
            ], { optional: true })
        ]),
    ]);
}

export const errorEnterLeaveAnimation = enterLeaveAnimationFactory('errorEnterLeave', ERROR_START, ERROR_END);

export const hintEnterLeaveAnimation = enterLeaveAnimationFactory('hintEnterLeave', HINT_START, HINT_END);
