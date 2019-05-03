import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagerComponent } from './messenger.component';

describe('MessagerComponent', () => {
  let component: MessagerComponent;
  let fixture: ComponentFixture<MessagerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MessagerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
