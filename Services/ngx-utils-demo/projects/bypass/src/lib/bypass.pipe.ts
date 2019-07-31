import { Inject, Pipe, PipeTransform } from '@angular/core';
import { BypassService } from './bypass.service';
import { BypassType } from './bypass.type';

@Pipe({
    name: 'bypass'
})
export class BypassPipe implements PipeTransform {

    constructor(
        @Inject(BypassService) private bypass: BypassService
    ) { }

    transform(value: string, type?: BypassType): any {
        return this.bypass.map(value, type);
    }
}
