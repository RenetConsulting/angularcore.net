import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatInputComponent } from './ngx-mat-input.component';

describe('NgxMatInputComponent', () => {
  let component: NgxMatInputComponent;
  let fixture: ComponentFixture<NgxMatInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMatInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMatInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
