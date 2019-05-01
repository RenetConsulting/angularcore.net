import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BlogModel } from '../../blog.model';

@Component({
    selector: 'lib-blog',
    templateUrl: './blog.component.html',
    styleUrls: ['./blog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlogComponent {

    @Input() item: BlogModel;
    @Input() created?: BlogModel;
    @Input() updated?: BlogModel;

    constructor() { }
}
