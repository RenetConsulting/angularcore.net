import * as UIActions from './actions';
import { BlogModel } from './blog.model';
import { blogReducer, BlogState } from './reducer';

describe('blogReducer', () => {

    let state: BlogState;

    beforeEach(() => {
        state = { ids: [], entities: {} };
    });

    it('GET_BLOGS_SUCCESS', () => {
        const totalAmount = 59;
        expect(blogReducer(state, new UIActions.GetBlogsSuccess({ items: [], totalAmount }))).toEqual({
            ...state,
            totalAmount
        } as BlogState);
    });
    it('GET_BLOG_REQUEST', () => {
        const selectedBlogId = '59';
        expect(blogReducer(state, new UIActions.GetBlogRequest(selectedBlogId))).toEqual({ ...state, selectedBlogId } as BlogState);
    });
    it('GET_BLOG_SUCCESS', () => {
        const item = { blogId: 'bob' } as BlogModel;
        expect(blogReducer(state, new UIActions.GetBlogSuccess(item))).toEqual({
            ids: [item.blogId],
            entities: { [item.blogId]: item }
        } as BlogState);
    });
    it('CREATE_BLOG_SUCCESS', () => {
        const item = { blogId: 'bob' } as BlogModel;
        expect(blogReducer(state, new UIActions.CreateBlogSuccess(item))).toEqual({
            ids: [item.blogId],
            entities: { [item.blogId]: item }
        } as BlogState);
    });
    it('UPDATE_BLOG_SUCCESS', () => {
        const item = { blogId: 'bob' } as BlogModel;
        const updated = { blogId: item.blogId, content: 'bob' } as BlogModel;
        expect(blogReducer({
            ids: [item.blogId],
            entities: { [item.blogId]: item }
        }, new UIActions.UpdateBlogSuccess(updated))).toEqual({
            ids: [updated.blogId],
            entities: { [updated.blogId]: updated }
        } as BlogState);
    });
    it('DELETE_BLOG_SUCCESS', () => {
        const item = { blogId: 'bob' } as BlogModel;
        expect(blogReducer({
            ids: [item.blogId],
            entities: { [item.blogId]: item }
        }, new UIActions.DeleteBlogSuccess(item.blogId))).toEqual(state);
    });
    it('HUB_CREATE_BLOG_SUCCESS', () => {
        const created = { blogId: 'bob' } as BlogModel;
        expect(blogReducer(state, new UIActions.HubCreateBlogSuccess(created))).toEqual({ ...state, created, updated: null } as BlogState);
    });
    it('HUB_UPDATE_BLOG_SUCCESS', () => {
        const updated = { blogId: 'bob' } as BlogModel;
        expect(blogReducer(state, new UIActions.HubUpdateBlogSuccess(updated))).toEqual({ ...state, updated, created: null } as BlogState);
    });
    it('DELETE_BLOGS', () => {
        const item = { blogId: 'bob' } as BlogModel;
        expect(blogReducer({
            ids: [item.blogId],
            entities: { [item.blogId]: item }
        }, new UIActions.DeleteBlogs())).toEqual({ ...state, created: null, updated: null } as BlogState);
    });
    it('default', () => {
        expect(blogReducer(state, { type: null } as any)).toEqual(state);
    });
});
