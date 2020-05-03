import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ValidatorComponent } from './validator.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxValidatorModule } from 'projects/ngx-validator/src/public-api';
import { ValidatorRoutingModule } from './validator-routing.module';

describe('ValidatorComponent', () => {
    let component: ValidatorComponent;
    let fixture: ComponentFixture<ValidatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ValidatorComponent],
            imports: [
                CommonModule,
                ValidatorRoutingModule,
                NgxValidatorModule,
                ReactiveFormsModule,
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ValidatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
