# TitleStrategy

This library provides a component and a service to set title from routes (include children).

## Usage Example

inside a module:
```ts
import { TitleStrategyModule } from '@renet-consulting/title-strategy';

@NgModule({
    imports: [
        RouterModule.forRoot([
            { path: '', component: HomeComponent, data: { title: 'Home Page' } }
        ]),
        TitleStrategyModule,
    ]
})
export class AppModule { }
```

inside html:
```html
<title-strategy></title-strategy>
```

## Release v17.0.0
Converted project to Angular v17

## Release v16.0.0
Converted project to Angular v16

## Release v15.0.0
Converted project to Angular v15

## Release v14.0.1
Upgrade "rxjs" to  "~6.6.7"

## Release v14.0.0
Converted project to Angular v14

## Release v9.0.0
Converted project to Angular v9
