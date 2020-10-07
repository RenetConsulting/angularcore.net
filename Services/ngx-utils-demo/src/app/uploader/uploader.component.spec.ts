import { waitForAsync, TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { UploaderComponent } from './uploader.component';
import { CommonModule } from '@angular/common';
import { NgxUploaderModule } from 'projects/ngx-uploader/src/public-api';
import { UploaderRoutingModule } from './uploader-routing.module';

describe('UploaderComponent', () => {
    let component: UploaderComponent;

    let http: HttpClient;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [UploaderComponent],
            imports: [
                CommonModule,
                UploaderRoutingModule,
                NgxUploaderModule
            ]
        })
            .compileComponents();
        http = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    }));

    beforeEach(() => {
        component = new UploaderComponent(http);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
