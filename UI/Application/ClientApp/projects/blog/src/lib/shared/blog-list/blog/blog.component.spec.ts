import { BlogComponent } from './blog.component';

describe('BlogComponent', () => {

    let component: BlogComponent;

    beforeEach(() => {
        component = new BlogComponent();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
