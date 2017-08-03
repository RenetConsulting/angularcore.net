import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		BrowserModule.withServerTransition({ appId: 'appId'}),
		ServerModule,
		AppModule
	]
})
export class AppModuleNode { }
