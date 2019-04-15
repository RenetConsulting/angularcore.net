import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState, getBlogEntities, getBlogs } from './reducer';
import { RootBlogStore } from './reducers';

const getModule = createFeatureSelector<RootBlogStore, BlogState>('blog');

const getAllBlogs = (s: BlogState) => s && getBlogs(s);

const getSelectedBlogId = (s: BlogState) => s.selectedBlogId;

const getBlogAllEntities = createSelector(getModule, getBlogEntities);

export const selectBlogs = createSelector(getModule, getAllBlogs);

export const selectSelectedBlogId = createSelector(getModule, getSelectedBlogId);

export const selectSelectedBlog = createSelector(getBlogAllEntities, selectSelectedBlogId, (entities, id) => entities[id]);