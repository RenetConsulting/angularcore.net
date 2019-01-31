import { Component, Inject, OnDestroy, OnInit } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Subscription } from "rxjs";
import { MessageHandlerService } from "../../services/message.handler/message.handler.service";

@Component({
    selector: "messager",
    template: ""
})
export class MessagerComponent implements OnInit, OnDestroy {

    readonly subscription = new Subscription();

    constructor(
        @Inject(MessageHandlerService) private messageHandlerService: MessageHandlerService,
        @Inject(MatSnackBar) private matSnackBar: MatSnackBar
    ) { }

    ngOnInit() {
        this.subscription.add(this.messageHandlerService.subject.subscribe(i => this.matSnackBar.open(i, "Close")))
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}