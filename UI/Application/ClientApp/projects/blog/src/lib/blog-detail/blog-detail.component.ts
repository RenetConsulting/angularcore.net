import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { GetBlogRequest, UpdateBlogRequest } from '../actions';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';
import { selectSelectedBlog } from '../selectors';

/** TODO: test shareReplay */
@Component({
    selector: 'lib-blog-detail',
    templateUrl: './blog-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit, OnDestroy {

    readonly item = this.store.select(selectSelectedBlog).pipe(shareReplay(1));
    readonly subscription = new Subscription();
    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.paramMap.pipe(
            map(x => x.get('blogId'))
        ).subscribe(x => this.store.dispatch(new GetBlogRequest(x))));
        this.subscription.add(this.item.subscribe(this.updateFormGroup));
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            title: new FormControl('', [Validators.required]),
            content: new FormControl('', [Validators.required])
        } as MapPick<BlogModel, keyof BlogModel, FormControl>);
    }

    updateFormGroup = (model?: BlogModel): void => {
        if (model) {
            model.editable ? this.formGroup.enable() : this.formGroup.disable();
            this.formGroup.patchValue(model);
        }
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new UpdateBlogRequest(this.formGroup.value));
        }
    }
}
