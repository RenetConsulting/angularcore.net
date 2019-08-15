import { BlogModel } from './blog.model';
import { BlogState } from './reducer';
import { selecBlogTotalAmount as selectBlogTotalAmount, selectBlogs, selectCreatedBlog, selectSelectedBlog, selectSelectedBlogId, selectUpdatedBlog } from './selectors';

describe('Selectors of blog', () => {

    it('selectBlogs', () => {
        const item = { blogId: 'bob' } as BlogModel;
        expect(selectBlogs({ blog: { ids: [item.blogId], entities: { [item.blogId]: item } } })).toEqual([item]);
    });
    it('selectSelectedBlogId', () => {
        const selectedBlogId = 'qwe';
        expect(selectSelectedBlogId({ blog: { selectedBlogId } as BlogState })).toEqual(selectedBlogId);
    });
    it('selectSelectedBlog', () => {
        const selectedBlogId = 'qwe';
        const item = { blogId: selectedBlogId } as BlogModel;
        expect(selectSelectedBlog({ blog: { ids: [item.blogId], entities: { [item.blogId]: item }, selectedBlogId } })).toEqual(item);
    });
    it('selecBlogTotalAmount', () => {
        const totalAmount = 25;
        expect(selectBlogTotalAmount({ blog: { totalAmount } as BlogState })).toEqual(totalAmount);
    });
    it('selectCreatedBlog', () => {
        const created = {} as BlogModel;
        expect(selectCreatedBlog({ blog: { created } as BlogState })).toEqual(created);
    });
    it('selectCreatedBlog', () => {
        const updated = {} as BlogModel;
        expect(selectUpdatedBlog({ blog: { updated } as BlogState })).toEqual(updated);
    });
});
