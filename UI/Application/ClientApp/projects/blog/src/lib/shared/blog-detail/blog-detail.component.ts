import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';
import { DeleteBlogPreRequest, GetBlogRequest, UpdateBlogRequest } from '../../core/actions';
import { BlogModel } from '../../core/blog.model';
import { RootBlogStore } from '../../core/reducers';
import { selectSelectedBlog } from '../../core/selectors';
import { MapPick } from '../../../../../../src/typings'

@Component({
    selector: 'lib-blog-detail',
    templateUrl: './blog-detail.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDetailComponent implements OnInit, OnDestroy {

    readonly item = this.store.select(selectSelectedBlog).pipe(shareReplay(1));
    readonly subscription = new Subscription();
    formGroup: FormGroup;
    blogId: string;

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
        @Inject(ActivatedRoute) private route: ActivatedRoute,
        @Inject(Title) private title: Title,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
        this.subscription.add(this.route.paramMap.pipe(
            map(x => x.get('blogId')),
            tap(x => this.blogId = x)
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
            this.title.setTitle(model.title);
        }
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new UpdateBlogRequest({ ...this.formGroup.value, blogId: this.blogId }));
        }
    }

    delete = () => this.store.dispatch(new DeleteBlogPreRequest(this.blogId));
}
