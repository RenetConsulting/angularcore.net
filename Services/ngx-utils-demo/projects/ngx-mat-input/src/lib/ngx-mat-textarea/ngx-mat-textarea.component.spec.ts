import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxMatTextareaComponent } from './ngx-mat-textarea.component';

describe('NgxMatTextareaComponent', () => {
  let component: NgxMatTextareaComponent;
  let fixture: ComponentFixture<NgxMatTextareaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxMatTextareaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxMatTextareaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
