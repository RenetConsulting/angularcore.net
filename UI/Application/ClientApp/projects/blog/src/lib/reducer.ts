import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { BlogActionsUnion } from './actions';
import { BlogModel } from './blog.model';
import { BlogTypes } from './types';

export interface BlogState extends EntityState<BlogModel> {
    selectedBlogId?: string;
    totalAmount?: number;
    updated?: BlogModel;
    created?: BlogModel;
}

const selectId = (i: BlogModel) => i.blogId;
const sortComparer = (a: BlogModel, b: BlogModel) => new Date(b.createdDate).valueOf() - new Date(a.createdDate).valueOf();
const adapter = createEntityAdapter({ selectId, sortComparer });
export const { selectAll, selectEntities, selectTotal } = adapter.getSelectors();
const INITIAL_STATE: BlogState = adapter.getInitialState({});

export function blogReducer(state = INITIAL_STATE, action: BlogActionsUnion): BlogState {

    switch (action.type) {

        case BlogTypes.GET_BLOGS_SUCCESS: return {
            ...adapter.upsertMany(action.success.items, state),
            totalAmount: action.success.totalAmount
        };
        case BlogTypes.GET_BLOG_REQUEST: return { ...state, selectedBlogId: action.payload };
        case BlogTypes.GET_BLOG_SUCCESS: return adapter.upsertOne(action.success, state);
        case BlogTypes.CREATE_BLOG_SUCCESS: return adapter.addOne(action.success, state);
        case BlogTypes.UPDATE_BLOG_SUCCESS: return adapter.updateOne({ id: action.payload.blogId, changes: action.payload }, state);
        case BlogTypes.DELETE_BLOG_SUCCESS: return adapter.removeOne(action.payload, state);
        case BlogTypes.HUB_CREATE_BLOG_SUCCESS: return { ...state, created: action.payload, updated: null };
        case BlogTypes.HUB_UPDATE_BLOG_SUCCESS: return { ...state, created: null, updated: action.payload };
        case BlogTypes.DELETE_BLOGS: return { ...adapter.removeAll(state), created: null, updated: null };

        default: return state;
    }
}
