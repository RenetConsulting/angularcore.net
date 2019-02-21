import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorMessageDialogComponent } from './error-message-dialog.component';

describe('ErrorMessageDialogComponent', () => {
  let component: ErrorMessageDialogComponent;
  let fixture: ComponentFixture<ErrorMessageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorMessageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorMessageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
