import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { TitleStrategyService } from './title-strategy.service';

@Component({
    selector: 'title-strategy',
    template: '',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TitleStrategyComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();

    constructor(
        @Inject(Router) private router: Router,
        @Inject(ActivatedRoute) private route: ActivatedRoute,
        @Inject(TitleStrategyService) private titleStrategy: TitleStrategyService,
    ) { }

    ngOnInit(): void {
        this.subscription.add(this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(() => this.route.snapshot),
            map(r => {
                while (r.firstChild) {
                    r = r.firstChild;
                }
                return r;
            }),
            map(x => x.data),
        ).subscribe(this.titleStrategy.set));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
