import { animate, query, stagger, style, transition, trigger } from '@angular/animations';

const initStyle = {
    opacity: 0,
    width: '0px',
    height: '0px'
};

export const enterLeaveHOW = trigger('enterLeaveHOW', [
    transition(':enter, * => void', []),
    transition(':increment', [
        query(':enter', [
            style(initStyle),
            stagger(150, [
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
                animate('300ms ease-out', style(initStyle)),
            ]),
        ])
    ]),
]);