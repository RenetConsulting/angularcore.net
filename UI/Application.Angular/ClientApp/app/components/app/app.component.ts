import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { ApplicationBase } from '../../bases/bases'
import { MetadataService } from '../../services/services';

@Component({
    selector: 'app',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent extends ApplicationBase implements OnInit, OnDestroy {

    constructor(
        @Inject('VERSION') private VERSION: string,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private metadataService: MetadataService
    ) {
        super();
    }

    ngOnInit() {
        console.log('VERSION', this.VERSION);

        this.routerEvents = this.router.events.subscribe((event) => {
            this.metadataService.setMetadata(event, this.activatedRoute.snapshot.firstChild);
        });
    }

    ngOnDestroy() {
        this.routerEvents.unsubscribe();
    }
}
