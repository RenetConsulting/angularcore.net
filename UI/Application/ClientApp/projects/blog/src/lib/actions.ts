import { Action } from "@ngrx/store";
import { BlogModel } from "./blog.model";
import { BlogTypes } from "./types";

export class GetBlogsRequest implements Action {
    readonly type = BlogTypes.GET_BLOGS_REQUEST;
    constructor() { }
}
export class GetBlogsSuccess implements Action {
    readonly type = BlogTypes.GET_BLOGS_SUCCESS;
    constructor(readonly success: Array<BlogModel>) { }
}
export class GetBlogsError implements Action {
    readonly type = BlogTypes.GET_BLOGS_ERROR;
    constructor(readonly error) { }
}

export class GetBlogRequest implements Action {
    readonly type = BlogTypes.GET_BLOG_REQUEST;
    constructor(readonly payload: string) { }
}
export class GetBlogSuccess implements Action {
    readonly type = BlogTypes.GET_BLOG_SUCCESS;
    constructor(readonly success: BlogModel, readonly payload: string) { }
}
export class GetBlogError implements Action {
    readonly type = BlogTypes.GET_BLOG_ERROR;
    constructor(readonly error) { }
}

export class UpdateBlogRequest implements Action {
    readonly type = BlogTypes.UPDATE_BLOG_REQUEST;
    constructor(readonly payload: BlogModel) { }
}
export class UpdateBlogSuccess implements Action {
    readonly type = BlogTypes.UPDATE_BLOG_SUCCESS;
    constructor(readonly payload: BlogModel) { }
}
export class UpdateBlogError implements Action {
    readonly type = BlogTypes.UPDATE_BLOG_ERROR;
    constructor(readonly error) { }
}

export class DeleteBlogRequest implements Action {
    readonly type = BlogTypes.DELETE_BLOG_REQUEST;
    constructor(readonly payload: string) { }
}
export class DeleteBlogSuccess implements Action {
    readonly type = BlogTypes.DELETE_BLOG_SUCCESS;
    constructor(readonly payload: string) { }
}
export class DeleteBlogError implements Action {
    readonly type = BlogTypes.DELETE_BLOG_ERROR;
    constructor(readonly error) { }
}

export type BlogActionsUnion = GetBlogsRequest
    | GetBlogsSuccess
    | GetBlogsError
    | GetBlogRequest
    | GetBlogSuccess
    | GetBlogError
    | UpdateBlogRequest
    | UpdateBlogSuccess
    | UpdateBlogError
    | DeleteBlogRequest
    | DeleteBlogSuccess
    | DeleteBlogError