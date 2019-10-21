import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FacebookSigninModule, GoogleSigninModule } from 'projects/external-auth/src/public-api';
import { ExternalRoutingModule } from './external-routing.module';
import { ExternalComponent } from './external.component';

@NgModule({
  declarations: [ExternalComponent],
  imports: [
    CommonModule,
    ExternalRoutingModule,
    GoogleSigninModule,
    FacebookSigninModule,
  ]
})
export class ExternalModule { }
