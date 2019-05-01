import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { BlogActionsUnion } from './actions';
import { BlogModel } from './blog.model';
import { BlogTypes } from './types';

export interface BlogState extends EntityState<BlogModel> {
    selectedBlogId?: string;
    itemsAmount?: number;
    loading?: boolean;
    updated?: BlogModel;
    created?: BlogModel;
}

const selectId = (i: BlogModel) => i.blogId;

const sortComparer = (a: BlogModel, b: BlogModel) =>
    new Date(a.createdDate).valueOf() - new Date(b.createdDate).valueOf();

const adapter = createEntityAdapter({ selectId, sortComparer });

export const { selectAll: getBlogs, selectEntities: getBlogEntities, selectTotal: getBlogsTotal } = adapter.getSelectors();

const INITIAL_STATE: BlogState = adapter.getInitialState({});

export function blogReducer(state = INITIAL_STATE, action: BlogActionsUnion): BlogState {

    switch (action.type) {

        case BlogTypes.GET_BLOGS_REQUEST: return { ...state, loading: true };
        case BlogTypes.GET_BLOGS_SUCCESS: {
            const itemsAmount = action.success.itemsAmount;
            const items = action.success.items;
            return { ...adapter.addMany(items, state), itemsAmount, loading: false };
        }
        case BlogTypes.GET_BLOGS_ERROR: return { ...state, loading: false };

        case BlogTypes.GET_BLOG_REQUEST: return { ...state, selectedBlogId: null, loading: true };
        case BlogTypes.GET_BLOG_SUCCESS: return {
            ...adapter.upsertOne(action.success, state),
            selectedBlogId: action.payload, loading: false
        };
        case BlogTypes.GET_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.CREATE_BLOG_REQUEST: return { ...state, loading: true };
        case BlogTypes.CREATE_BLOG_SUCCESS: return { ...adapter.addOne(action.success, state), loading: false };
        case BlogTypes.CREATE_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.UPDATE_BLOG_REQUEST: return { ...state, loading: true };
        case BlogTypes.UPDATE_BLOG_SUCCESS: return {
            ...adapter.updateOne({ id: action.payload.blogId, changes: action.payload }, state),
            loading: false
        };
        case BlogTypes.UPDATE_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.DELETE_BLOG_REQUEST: return { ...state, loading: true };
        case BlogTypes.DELETE_BLOG_SUCCESS: return { ...adapter.removeOne(action.payload, state), loading: false };
        case BlogTypes.DELETE_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.HUB_CREATE_BLOG_SUCCESS: return { ...state, created: action.payload, updated: null, loading: false };
        case BlogTypes.HUB_UPDATE_BLOG_SUCCESS: return { ...state, created: null, updated: action.payload, loading: false };

        case BlogTypes.DELETE_BLOGS: return { ...adapter.removeAll(state), created: null, updated: null, loading: false };

        default: return state;
    }
}