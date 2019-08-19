import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxAComponent } from './ngx-a.component';

describe('NgxAComponent', () => {
    let component: NgxAComponent;
    let fixture: ComponentFixture<NgxAComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [NgxAComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(NgxAComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
