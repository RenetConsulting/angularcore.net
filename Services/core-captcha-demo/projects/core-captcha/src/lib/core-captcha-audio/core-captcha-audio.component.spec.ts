import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreCaptchaAudioComponent } from './core-captcha-audio.component';

describe('CoreCaptchaAudioComponent', () => {
  let component: CoreCaptchaAudioComponent;
  let fixture: ComponentFixture<CoreCaptchaAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoreCaptchaAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreCaptchaAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
