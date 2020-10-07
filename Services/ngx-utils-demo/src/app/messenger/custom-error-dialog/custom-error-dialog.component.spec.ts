import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomErrorDialogComponent } from './custom-error-dialog.component';

describe('CustomErrorDialogComponent', () => {
    let component: CustomErrorDialogComponent;
    let fixture: ComponentFixture<CustomErrorDialogComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [CustomErrorDialogComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CustomErrorDialogComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
