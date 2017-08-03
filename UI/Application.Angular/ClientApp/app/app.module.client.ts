import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		BrowserModule.withServerTransition({ appId: 'appId' }),
		AppModule
	],
	providers: [
		{ provide: 'ORIGIN_URL', useValue: location.origin },
		{ provide: 'isBrowser', useValue: true },
	]
})
export class AppModuleBrowser { }
