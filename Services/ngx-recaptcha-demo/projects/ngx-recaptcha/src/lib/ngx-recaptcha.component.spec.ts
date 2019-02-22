import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxRecaptchaComponent } from './ngx-recaptcha.component';

describe('NgxRecaptchaComponent', () => {
  let component: NgxRecaptchaComponent;
  let fixture: ComponentFixture<NgxRecaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxRecaptchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxRecaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
