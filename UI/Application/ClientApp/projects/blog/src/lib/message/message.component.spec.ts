import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageComponent } from './message.component';

describe('MessageComponent', () => {

    let component: MessageComponent;

    let snackBar: jasmine.SpyObj<MatSnackBar>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: MatSnackBar, useValue: jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['dismiss']) }
            ]
        });

        snackBar = TestBed.get(MatSnackBar);

        component = new MessageComponent(snackBar);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
