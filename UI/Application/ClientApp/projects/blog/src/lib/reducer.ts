import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { BlogActionsUnion } from './actions';
import { BlogModel } from "./blog.model";
import { BlogTypes } from './types';

export interface BlogState extends EntityState<BlogModel> {
    selectedBlogId?: string;
    loading?: boolean;
}

const selectId = (i: BlogModel) => i.blogId;

const adapter = createEntityAdapter({ selectId });

const INITIAL_STATE: BlogState = adapter.getInitialState({});

export function blogReducer(state = INITIAL_STATE, action: BlogActionsUnion): BlogState {

    switch (action.type) {

        case BlogTypes.GET_BLOGS_REQUEST: return { ...adapter.removeAll(state), loading: true };
        case BlogTypes.GET_BLOGS_SUCCESS: return { ...adapter.addMany(action.success, state), loading: false };
        case BlogTypes.GET_BLOGS_ERROR: return { ...state, loading: false };

        case BlogTypes.GET_BLOG_REQUEST: return { ...state, selectedBlogId: null, loading: true };
        case BlogTypes.GET_BLOG_SUCCESS: return { ...adapter.upsertOne(action.success, state), selectedBlogId: action.payload, loading: false };
        case BlogTypes.GET_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.UPDATE_BLOG_REQUEST: return { ...state, loading: true };
        case BlogTypes.UPDATE_BLOG_SUCCESS: return { ...adapter.updateOne({ id: action.payload.blogId, changes: action.payload }, state), loading: false };
        case BlogTypes.UPDATE_BLOG_ERROR: return { ...state, loading: false };

        case BlogTypes.DELETE_BLOG_REQUEST: return { ...state, loading: true };
        case BlogTypes.DELETE_BLOG_SUCCESS: return { ...adapter.removeOne(action.payload, state), loading: false };
        case BlogTypes.DELETE_BLOG_ERROR: return { ...state, loading: false };

        default: return state;
    }
}

export const { selectAll: getBlogs, selectEntities: getBlogEntities } = adapter.getSelectors();