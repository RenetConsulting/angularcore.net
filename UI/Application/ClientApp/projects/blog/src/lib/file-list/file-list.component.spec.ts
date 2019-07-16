import { TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { RootBlogStore } from '../reducers';
import { FileListComponent } from './file-list.component';

describe('FileListComponent', () => {

    let component: FileListComponent;

    let store: MockStore<RootBlogStore>;
    let dialogRef: jasmine.SpyObj<MatDialogRef<FileListComponent>>;

    beforeEach(() => {

        TestBed.configureTestingModule({
            providers: [
                provideMockStore({}),
                { provide: MatDialogRef, useValue: jasmine.createSpyObj<MatDialogRef<FileListComponent>>('MatDialogRef', ['close']) }
            ]
        });

        store = TestBed.get(Store);
        dialogRef = TestBed.get(MatDialogRef);

        component = new FileListComponent(store, dialogRef);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
