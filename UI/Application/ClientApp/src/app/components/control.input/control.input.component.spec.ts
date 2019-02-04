import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControlInputComponent } from './control.input.component';

describe('TestInputComponent', () => {
  let component: ControlInputComponent;
  let fixture: ComponentFixture<ControlInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControlInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControlInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
