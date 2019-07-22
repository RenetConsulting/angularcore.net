import { NgxErrorDialogComponent } from './ngx-error-dialog.component';
import { NgxDefaultSecurityService } from './ngx-default-security.service';
import { BehaviorSubject } from 'rxjs';

describe('NgxErrorDialogComponent', () => {

    let component: NgxErrorDialogComponent;

    let security: jasmine.SpyObj<NgxDefaultSecurityService>;

    beforeEach(() => {

        security = jasmine.createSpyObj<NgxDefaultSecurityService>('NgxDefaultSecurityService', ['map']);

        component = new NgxErrorDialogComponent(security);
    });

    it('error instanceof BehaviorSubject', () => {
        expect(component.error instanceof BehaviorSubject).toEqual(true);
    });
    it('setError', () => {
        spyOn(component.error, 'next');
        const error = 'error';
        const mappedError = 'mapped error';

        security.map.and.returnValue(mappedError);

        component.setError(error);

        expect(security.map).toHaveBeenCalledWith(error);
        expect(component.error.next).toHaveBeenCalledWith(mappedError);
    });
});
