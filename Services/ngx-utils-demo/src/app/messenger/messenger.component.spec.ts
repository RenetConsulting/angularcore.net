import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagerComponent } from './messenger.component';
import { CommonModule } from '@angular/common';
import { NgxMessengerModule } from 'projects/ngx-messenger/src/public-api';
import { CustomErrorDialogModule } from './custom-error-dialog/custom-error-dialog.module';
import { MessagerRoutingModule } from './messenger-routing.module';

describe('MessagerComponent', () => {
    let component: MessagerComponent;
    let fixture: ComponentFixture<MessagerComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [MessagerComponent],
            imports: [
                CommonModule,
                MessagerRoutingModule,
                NgxMessengerModule,
                CustomErrorDialogModule
            ]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MessagerComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
