import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ViewportComponent } from './viewport.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { ViewportRoutingModule } from './viewport-routing.module';
import { ViewportChangeModule } from 'projects/viewport-change/src/public-api';

describe('ViewportComponent', () => {
  let component: ViewportComponent;
  let fixture: ComponentFixture<ViewportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [ViewportComponent],
        imports: [
            CommonModule,
            ViewportRoutingModule,
            ScrollingModule,
            ViewportChangeModule
        ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
