import { waitForAsync, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Data, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { TitleStrategyComponent } from './title-strategy.component';
import { TitleStrategyService } from './title-strategy.service';

describe('TitleStrategyComponent', () => {

    let component: TitleStrategyComponent;

    let router: Router;
    let route: ActivatedRoute;
    let titleStrategy: jasmine.SpyObj<TitleStrategyService>;
    const data = { title: 'Helloooo' } as Data;

    beforeEach(waitForAsync(() => {

        TestBed.configureTestingModule({
            providers: [
                { provide: TitleStrategyService, useValue: jasmine.createSpyObj<TitleStrategyService>('TitleStrategyService', ['set']) },
                {
                    provide: Router,
                    useValue: {
                        events: of(new NavigationEnd(0, '', ''))
                    } as Partial<Router>
                },
                {
                    provide: ActivatedRoute,
                    useValue: {
                        snapshot: {
                            firstChild: { data } as ActivatedRouteSnapshot
                        } as ActivatedRouteSnapshot
                    } as ActivatedRoute
                }
            ]
        }).compileComponents();

        router = TestBed.inject(Router);
        route = TestBed.inject(ActivatedRoute);
        titleStrategy = TestBed.inject(TitleStrategyService) as jasmine.SpyObj<TitleStrategyService>;
        component = new TitleStrategyComponent(router, route, titleStrategy);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        component.ngOnInit();
        expect(titleStrategy.set).toHaveBeenCalledWith(data);
        component.ngOnDestroy();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
});
