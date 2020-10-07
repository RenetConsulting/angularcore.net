import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ExternalComponent } from './external.component';
import { CommonModule } from '@angular/common';
import { FacebookSigninModule, GoogleSigninModule } from 'projects/external-auth/src/public-api';
import { ExternalRoutingModule } from './external-routing.module';

describe('ExternalComponent', () => {
    let component: ExternalComponent;
    let fixture: ComponentFixture<ExternalComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ExternalComponent],
            imports: [
                CommonModule,
                ExternalRoutingModule,
                GoogleSigninModule,
                FacebookSigninModule,
            ]

        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ExternalComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
