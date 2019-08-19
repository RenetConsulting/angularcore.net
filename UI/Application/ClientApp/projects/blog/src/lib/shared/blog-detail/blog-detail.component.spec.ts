import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { GetBlogRequest, UpdateBlogRequest } from '../../core/actions';
import { BlogModel } from '../../core/blog.model';
import { RootBlogStore } from '../../core/reducers';
import { BlogDetailComponent } from './blog-detail.component';

describe('BlogDetailComponent', () => {

    let component: BlogDetailComponent;

    let store: MockStore<RootBlogStore>;
    let route: ActivatedRoute;
    let paramMap: jasmine.SpyObj<ParamMap>;
    let title: jasmine.SpyObj<Title>;

    beforeEach(() => {

        paramMap = jasmine.createSpyObj<ParamMap>('ParamMap', ['get']);

        TestBed.configureTestingModule({
            providers: [
                provideMockStore({}),
                { provide: ActivatedRoute, useValue: { paramMap: of(paramMap) } as Partial<ActivatedRoute> },
                { provide: Title, useValue: jasmine.createSpyObj<Title>('Title', ['setTitle']) }
            ]
        });

        store = TestBed.get(Store);
        route = TestBed.get(ActivatedRoute);
        title = TestBed.get(Title);

        component = new BlogDetailComponent(store, route, title);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'updateFormGroup');
        spyOn(store, 'dispatch');
        const blogId = 'bob';
        store.setState({ blog: { selectedBlogId: blogId, ids: [blogId], entities: { [blogId]: { blogId } as BlogModel } } });
        paramMap.get.and.returnValue(blogId);

        component.ngOnInit();

        expect(store.dispatch).toHaveBeenCalledWith(new GetBlogRequest(blogId));
        expect(component.updateFormGroup).toHaveBeenCalled();
    });
    it('ngOnDestroy', () => {
        component.ngOnDestroy();
        expect(component.subscription.closed).toEqual(true);
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });

    describe('updateFormGroup', () => {

        it('disable', () => {
            component.formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['disable', 'patchValue']);
            const item = { editable: false } as BlogModel;
            component.updateFormGroup(item);
            expect(component.formGroup.disable).toHaveBeenCalled();
            expect(component.formGroup.patchValue).toHaveBeenCalled();
            expect(title.setTitle).toHaveBeenCalled();
        });
        it('enable', () => {
            component.formGroup = jasmine.createSpyObj<FormGroup>('FormGroup', ['enable', 'patchValue']);
            const item = { editable: true } as BlogModel;
            component.updateFormGroup(item);
            expect(component.formGroup.enable).toHaveBeenCalled();
            expect(component.formGroup.patchValue).toHaveBeenCalled();
            expect(title.setTitle).toHaveBeenCalled();
        });
    });

    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true, value: {} } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new UpdateBlogRequest({ ...component.formGroup.value, blogId: component.blogId }));
    });
});
