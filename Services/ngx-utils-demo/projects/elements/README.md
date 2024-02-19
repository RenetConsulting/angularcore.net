# Elements

This library provides custom element for tag ``a``that allow no navigate inside app. 
Before adding this package to a module be sure that you have added:
1. ``CUSTOM_ELEMENTS_SCHEMA`` to ``schemas`` in your ``NgModule``
2. install the package ``@angular/elements`` by the command ``ng add @angular/elements``
3. then install ``@webcomponents/webcomponentsjs`` to use elements with ``es5`` (and update your polyfill.ts file with next line ``import '@webcomponents/webcomponentsjs/custom-elements-es5-adapter.js';``) otherwhise change ``es5`` to ``es2015`` in your global typescript file.


The package is not completed, it has few bugs that are described in 
- https://github.com/angular/angular/issues/29606
- https://github.com/angular/angular/issues/30207

## Release v17.0.0
Converted project to Angular v17

## Release v16.0.0
Converted project to Angular v16

## Release v15.0.0
Converted project to Angular v15

## Release v14.0.0
Converted project to Angular v14

## Release v9.0.0
Converted project to Angular v9
