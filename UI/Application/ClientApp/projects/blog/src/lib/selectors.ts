import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BlogState, getBlogEntities, getBlogs, getBlogsTotal } from './reducer';
import { RootBlogStore } from './reducers';

const getModule = createFeatureSelector<RootBlogStore, BlogState>('blog');

const getAllBlogs = (s: BlogState) => s && getBlogs(s);

const getSelectedBlogId = (s: BlogState) => s.selectedBlogId;

const getBlogsAmount = (s: BlogState) => s.itemsAmount;

const getBlogAllEntities = createSelector(getModule, getBlogEntities);

export const selectBlogs = createSelector(getModule, getAllBlogs);

export const selectSelectedBlogId = createSelector(getModule, getSelectedBlogId);

export const selectSelectedBlog = createSelector(getBlogAllEntities, selectSelectedBlogId, (entities, id) => entities[id]);

/** returns number of blogs that are in DB */
export const selectBlogsTotal = createSelector(getModule, getBlogsTotal);

/** returns number of blogs that are in store */
export const selectBlogsAmount = createSelector(getModule, getBlogsAmount);