import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCaptchaComponent } from './core-captcha.component';

describe('CoreCaptchaComponent', () => {
  let component: CoreCaptchaComponent;
  let fixture: ComponentFixture<CoreCaptchaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreCaptchaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
