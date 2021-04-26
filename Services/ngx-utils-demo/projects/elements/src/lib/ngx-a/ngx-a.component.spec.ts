import { async, TestBed } from '@angular/core/testing';
import { Router, NavigationEnd } from '@angular/router';
import { NgxAComponent } from './ngx-a.component';
import { of } from 'rxjs';

describe('NgxAComponent', () => {
    let component: NgxAComponent;
    let router: Router;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [NgxAComponent],
            providers: [
                {
                    provide: Router,
                    useValue: {
                        events: of(new NavigationEnd(0, '', ''))
                    } as Partial<Router>
                }
            ]
        }).compileComponents();

    }));

    beforeEach(() => {
        router = TestBed.inject(Router);
        component = new NgxAComponent(router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
