import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { FileModel } from '../file.model';

@Component({
    selector: 'lib-file',
    templateUrl: './file.component.html',
    styleUrls: ['./file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent {

    @Input() item: FileModel;
    @Output() readonly delete = new EventEmitter<FileModel>();
    @Output() readonly select = new EventEmitter<FileModel>();

    constructor() { }

    onDelete = () => this.delete.emit(this.item);

    onSelect = () => this.select.emit(this.item);
}
