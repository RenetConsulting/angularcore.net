import { TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CreateBlogRequest } from '../../core/actions';
import { RootBlogStore } from '../../core/reducers';
import { BlogDashboardComponent } from './blog-dashboard.component';

describe('BlogDashboardComponent', () => {

    let component: BlogDashboardComponent;

    let store: MockStore<RootBlogStore>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [provideMockStore({})]
        });

        store = TestBed.inject(Store as any);

        component = new BlogDashboardComponent(store);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('ngOnInit', () => {
        spyOn(component, 'setFormGroup');
        component.ngOnInit();
        expect(component.setFormGroup).toHaveBeenCalled();
    });
    it('setFormGroup', () => {
        component.setFormGroup();
        expect(component.formGroup instanceof FormGroup).toEqual(true);
    });
    it('submit', () => {
        spyOn(store, 'dispatch');
        component.formGroup = { valid: true, value: {} } as FormGroup;
        component.submit();
        expect(store.dispatch).toHaveBeenCalledWith(new CreateBlogRequest(component.formGroup.value));
    });
});
