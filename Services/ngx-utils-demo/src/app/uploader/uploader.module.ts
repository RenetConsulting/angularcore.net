import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxUploaderModule } from 'projects/ngx-uploader/src/public-api';
import { UploaderRoutingModule } from './uploader-routing.module';
import { UploaderComponent } from './uploader.component';

@NgModule({
    declarations: [UploaderComponent],
    imports: [
        CommonModule,
        UploaderRoutingModule,
        NgxUploaderModule
    ]
})
export class UploaderModule {
}
