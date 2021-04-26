import { Component, OnInit } from '@angular/core';
import { ExternalTokenHandlerService } from 'projects/external-auth/src/public-api';
import { HandlerService } from './handler.service';

@Component({
  selector: 'app-external',
  templateUrl: './external.component.html',
  styleUrls: ['./external.component.css'],
  providers: [{ provide: ExternalTokenHandlerService, useClass: HandlerService }],
})
export class ExternalComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  test = x => console.log(x);

}
