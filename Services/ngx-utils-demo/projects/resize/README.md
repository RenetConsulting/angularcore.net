# Resize

This library provides a directive that listens resize event of an element.

## Polyfill

There are few veriants of polyfills:
[resize-observer-polyfill](https://www.npmjs.com/package/resize-observer-polyfill)
[resize-observer](https://www.npmjs.com/package/resize-observer)

## Usage Example

inside a module:
```
import { ResizeModule } from '@renet-consulting/resize';

@NgModule({
    ...
    imports: [
        ResizeModule,
    ]
})
export class AppModule { }
```

inside html:
```
...
<div (resize)="handleResize($event)">
    any text
</div>
...
```
