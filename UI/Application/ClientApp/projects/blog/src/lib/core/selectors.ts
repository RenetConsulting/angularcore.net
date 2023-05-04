import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as State from './reducer';
import { RootBlogStore } from './reducers';

const getModule = createFeatureSelector< State.BlogState>('blog');
const getAllBlogs = (s: State.BlogState) => s && State.selectAll(s);
const getSelectedBlogId = (s: State.BlogState) => s.selectedBlogId;
const getTotalAmount = (s: State.BlogState) => s.totalAmount;
const getCreatedBlog = (s: State.BlogState) => s.created;
const getUpdatedBlog = (s: State.BlogState) => s.updated;
const getBlogAllEntities = createSelector(getModule, State.selectEntities);

export const selectBlogs = createSelector(getModule, getAllBlogs);
export const selectSelectedBlogId = createSelector(getModule, getSelectedBlogId);
export const selectSelectedBlog = createSelector(getBlogAllEntities, selectSelectedBlogId, (entities, id) => entities[id]);
export const selecBlogTotalAmount = createSelector(getModule, getTotalAmount);
export const selectCreatedBlog = createSelector(getModule, getCreatedBlog);
export const selectUpdatedBlog = createSelector(getModule, getUpdatedBlog);
