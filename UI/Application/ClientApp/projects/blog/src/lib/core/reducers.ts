import { FileState } from './components/file-list/reducer';
import { BlogState } from './reducer';

export interface RootBlogStore {
    blog?: BlogState;
    file?: FileState;
}
