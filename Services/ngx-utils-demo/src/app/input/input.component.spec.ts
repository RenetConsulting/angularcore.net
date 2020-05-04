import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputRoutingModule } from './input-routing.module';
import { NgxMatInputModule } from 'projects/ngx-mat-input/src/public-api';
import { ResizeModule } from 'projects/resize/src/public-api';
import { MatCardModule } from '@angular/material/card';

import { InputComponent } from './input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('InputComponent', () => {
    let component: InputComponent;
    let fixture: ComponentFixture<InputComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [InputComponent],
            imports: [
                ReactiveFormsModule,
                CommonModule,
                InputRoutingModule,
                NgxMatInputModule,
                ResizeModule,
                MatCardModule,
                BrowserAnimationsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InputComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
