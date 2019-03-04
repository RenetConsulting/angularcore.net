import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninExternalComponent } from './signin-external.component';

describe('SigninExternalComponent', () => {
  let component: SigninExternalComponent;
  let fixture: ComponentFixture<SigninExternalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninExternalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninExternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
