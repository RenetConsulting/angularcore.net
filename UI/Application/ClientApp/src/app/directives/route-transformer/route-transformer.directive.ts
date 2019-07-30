import { Directive, HostListener, Inject } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
    selector: '[routeTransformer]'
})
export class RouteTransformerDirective {

    constructor(
        @Inject(Router) private router: Router
    ) { }

    @HostListener('click', ['$event']) onClick = (e): void => {
        if (e && e.target && e.target.tagName === 'A') {
            const href = e.target.getAttribute('href');
            if (href) {
                this.router.navigate([href]);
                e.preventDefault();
            }
        }
    }
}
