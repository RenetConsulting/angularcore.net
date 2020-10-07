import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { StorageComponent } from './storage.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { StorageRoutingModule } from './storage-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('StorageComponent', () => {
    let component: StorageComponent;
    let fixture: ComponentFixture<StorageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [StorageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            imports: [
                CommonModule,
                StorageRoutingModule,
                ReactiveFormsModule
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(StorageComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
