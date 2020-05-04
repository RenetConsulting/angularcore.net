import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CaptchaRoutingModule } from './captcha-routing.module';
import { CoreCaptchaModule } from 'projects/core-captcha/src/public_api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CaptchaComponent } from './captcha.component';

describe('CaptchaComponent', () => {
    let component: CaptchaComponent;
    let fixture: ComponentFixture<CaptchaComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [CaptchaComponent],
            imports: [
                ReactiveFormsModule,
                CommonModule,
                CaptchaRoutingModule,
                HttpClientModule,
                CoreCaptchaModule,
                BrowserAnimationsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CaptchaComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
