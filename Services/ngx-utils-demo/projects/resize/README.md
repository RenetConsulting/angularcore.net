# Resize

This library provides a directive that listens resize event of an element.

## Dependencies

This library depends on ``resize-observer-polyfill``

## Installation

At first please install dependencies ([resize-observer-polyfill](https://www.npmjs.com/package/resize-observer-polyfill)):
```
npm install resize-observer-polyfill --save-dev
```

then install 
```
npm install @renet-consulting/resize --save-dev
```

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
