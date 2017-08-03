/*
 * --Base-- SHARED Module
 * 
 * This has the most "basic" Shared imports that can be imported into 
 * all children (lazy-loaded for example) NgModules.
 * (ie: Admin NgModule can import this, to import all the basic App functionality, FormsModule, CommonModule etc)
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpModule } from '@angular/http';

declare var isDevelopment: any;
declare var VERSION: any;

@NgModule({
	imports: [
		CommonModule,
		HttpModule
	],
	exports: [
		CommonModule, FormsModule, ReactiveFormsModule, HttpModule
	],
	providers: [
		{ provide: 'isBrowser', useValue: null },
		{ provide: 'isNode', useValue: null },
		{ provide: 'isDevelopment', useValue: (typeof isDevelopment != 'undefined') ? isDevelopment : null },
		{ provide: 'VERSION', useValue: (typeof VERSION != 'undefined') ? VERSION : null },
		{ provide: 'WINDOW', useValue: null },
	]

})
export class BaseSharedModule {
}