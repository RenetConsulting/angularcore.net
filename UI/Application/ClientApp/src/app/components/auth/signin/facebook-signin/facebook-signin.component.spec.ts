import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSigninComponent } from './facebook-signin.component';

describe('FacebookSigninComponent', () => {
  let component: FacebookSigninComponent;
  let fixture: ComponentFixture<FacebookSigninComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacebookSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacebookSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
