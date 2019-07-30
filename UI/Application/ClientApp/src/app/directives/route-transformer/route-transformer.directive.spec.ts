import { RouteTransformerDirective } from './route-transformer.directive';
import { Router } from '@angular/router';

describe('RouteTransformerDirective', () => {

    let directive: RouteTransformerDirective;

    let router: jasmine.SpyObj<Router>;
    let event: MouseEvent;
    let target: jasmine.SpyObj<Element>;

    beforeEach(() => {

        target = { tagName: 'A', getAttribute: jasmine.createSpy() as any } as jasmine.SpyObj<Element>;
        event = { target: target as EventTarget, preventDefault: jasmine.createSpy() as any } as MouseEvent;
        router = jasmine.createSpyObj<Router>('Router', ['navigate']);

        directive = new RouteTransformerDirective(router);
    });

    it('should create an instance', () => {
        expect(directive).toBeTruthy();
    });
    it('onClick', () => {
        const href = '/bob';
        target.getAttribute.and.returnValue(href);
        directive.onClick(event);
        expect(target.getAttribute).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalledWith([href]);
        expect(event.preventDefault).toHaveBeenCalled();
    });
});
