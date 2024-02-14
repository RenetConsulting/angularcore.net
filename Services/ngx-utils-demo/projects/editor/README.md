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

## Release v15.0.0
Converted project to Angular v15

## Release v14.0.0
Converted project to Angular v14

## Release v10.0.3
Added missing stylesheets

## Release v10.0.2
Fixed naming convention

## Release v10.0.1
Revert to Angular v9 to support es5

## Release v10.0.0
Converted project to Angular v10

## Release v9.0.0
Converted project to Angular v9

## Release v9.0.1
Added missing theme.scss