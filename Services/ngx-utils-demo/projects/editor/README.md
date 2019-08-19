# Editor

This library provides an editor that is based on ``ngx-quill``.

## Dependencies
The library has next dependencies:
- @renet-consulting/control-value-accessor
- @renet-consulting/ngx-validator
- ngx-quill
- quill

## Usage Example
Replace handlers on titlebar
```
import { ToolbarHandlersService } from '@renet-consulting/editor';

@Injectable()
export class AppToolbarHandlersService implements ToolbarHandlersService {

    constructor(
        @Inject(MESSAGE) private message: string
    ) { }

    image = (): void => {
        alert('A user clicks on the image button.' + this.message);
    }

    video = (): void => {
        alert('A user clicks on the video button.' + this.message);
    }
}
```
