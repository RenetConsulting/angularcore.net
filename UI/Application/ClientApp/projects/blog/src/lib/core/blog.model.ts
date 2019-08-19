import { BlogBaseModel } from './blog-base.model';

export class BlogModel extends BlogBaseModel {

    blogId?: string;
    title: string;
    content: string;
    editable: boolean;
    createdBy: string;
}
