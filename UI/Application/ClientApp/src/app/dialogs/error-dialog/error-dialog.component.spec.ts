import { NgxErrorDialogComponent } from '@renet-consulting/ngx-messenger';
import { ErrorDialogComponent } from './error-dialog.component';

describe('ErrorDialogComponent', () => {

    let component: ErrorDialogComponent;

    beforeEach(() => {
        component = new ErrorDialogComponent(null);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be instanceof NgxErrorDialogComponent', () => {
        expect(component instanceof NgxErrorDialogComponent).toEqual(true);
    });
});
