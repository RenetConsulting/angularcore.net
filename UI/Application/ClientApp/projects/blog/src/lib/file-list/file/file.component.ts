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
    @Output() readonly deleteChange = new EventEmitter<FileModel>();
    @Output() readonly selectChange = new EventEmitter<FileModel>();

    constructor() { }

    delete = () => this.deleteChange.emit(this.item);

    select = () => this.selectChange.emit(this.item);
}
