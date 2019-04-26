import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { getFormData } from 'projects/ngx-uploader/src/lib/utils';

@Component({
    selector: 'app-uploader',
    templateUrl: './uploader.component.html',
    styleUrls: ['./uploader.component.css']
})
export class UploaderComponent implements OnInit {

    constructor(
        @Inject(HttpClient) public http: HttpClient
    ) { }

    ngOnInit() {
    }

    upload = (x) => {
        console.log(x);
        this.http.post('https://httpbin.org/post', getFormData(x)).subscribe(console.log);
    }
}
