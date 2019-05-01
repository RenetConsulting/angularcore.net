import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { CreateBlogRequest, DeleteBlogs } from '../actions';
import { BlogModel } from '../blog.model';
import { RootBlogStore } from '../reducers';

@Component({
    selector: 'lib-blog-dashboard',
    templateUrl: './blog-dashboard.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogDashboardComponent implements OnInit, OnDestroy {

    formGroup: FormGroup;

    constructor(
        @Inject(Store) private store: Store<RootBlogStore>,
    ) { }

    ngOnInit(): void {
        this.setFormGroup();
    }

    ngOnDestroy(): void {
        this.store.dispatch(new DeleteBlogs());
    }

    setFormGroup = (): void => {
        this.formGroup = new FormGroup({
            title: new FormControl('', [Validators.required]),
            content: new FormControl('', [Validators.required])
        } as MapPick<BlogModel, keyof BlogModel, FormControl>);
    }

    submit = (): void => {
        if (this.formGroup.valid) {
            this.store.dispatch(new CreateBlogRequest(this.formGroup.value));
        }
    }
}
