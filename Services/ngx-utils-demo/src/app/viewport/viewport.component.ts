import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-viewport',
    templateUrl: './viewport.component.html',
    styleUrls: ['./viewport.component.css']
})
export class ViewportComponent implements OnInit {

    items = Array.from({ length: 100000 }).map((_, i) => `Item #${i}`);

    change = console.log;

    constructor() { }

    ngOnInit() {
    }

    create = () => {
        this.items = [new Date().toString()].concat(this.items);
    }

    delete = () => {
        this.items = this.items.filter((_, i) => i !== 0);
    }
}
