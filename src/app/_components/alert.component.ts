import {Component, OnInit, OnDestroy, Output, EventEmitter, Input} from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '@app/_services';
import {isUndefined} from "ngx-bootstrap/chronos/utils/type-checks";

@Component({
    selector: "alert",
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    linkClicked(event){
        this.alertService.setLinkData(event);
    }

    close() {
        this.message = undefined;
    }
}