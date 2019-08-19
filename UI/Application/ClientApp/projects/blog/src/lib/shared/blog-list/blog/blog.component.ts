import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { BlogModel } from '../../../core/blog.model';

@Component({
    selector: 'lib-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None
})
export class BlogComponent {

    @Input() item: BlogModel;
    @Input() created?: BlogModel;
    @Input() updated?: BlogModel;
    readonly maxHeight = 100;
    showButton: boolean;

    constructor() { }

    handleResize = (e: DOMRectReadOnly): void => {
        this.showButton = e.height > this.maxHeight;
    }
}
