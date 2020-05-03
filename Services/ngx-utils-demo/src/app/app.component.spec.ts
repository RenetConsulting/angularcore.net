import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { TitleStrategyModule } from 'projects/title-strategy/src/public-api';
import { NgxAModule } from 'projects/elements/src/lib/ngx-a/ngx-a.module';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
        ],
        imports: [
            BrowserModule,
            HttpClientModule,
            BrowserAnimationsModule,
            RouterModule.forRoot(ROUTES),
            NgxAModule,
            TitleStrategyModule
        ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'ngx-utils-demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('ngx-utils-demo');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to ngx-utils-demo!');
  });
});
