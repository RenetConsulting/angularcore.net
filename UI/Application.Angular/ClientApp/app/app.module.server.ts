import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { AppComponent } from './components/components';
import { AppModule } from './app.module';

@NgModule({
	bootstrap: [AppComponent],
	imports: [
		ServerModule,
		AppModule
	]
})
export class AppModuleServer { }
