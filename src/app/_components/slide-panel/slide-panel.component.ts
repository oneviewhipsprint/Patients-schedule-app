import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from "@angular/core";

@Component({
    selector: "slide-panel",
    template: `
        <div data-automation-id="slide-panel" class="slide-panel" [class.slide-panel--open]="isOpen">
            <button (click)="closePanel()"
                    data-automation-id="slide-panel__btn-close"
                    type="button" class="slide-panel__btn-close close" aria-label="Close">
                <span aria-hidden="false" class="slide-panel__btn-close--text" id="slide-panel-close-button">x</span>
            </button>

            <div class="slide-panel__header">
                <div class="slide-panel__header__title">{{title}}</div>
                <div class="slide-panel__header__content">
                    <ng-content select="panel-header"></ng-content>
                </div>
            </div>

            <div #contentContainer class="slide-panel__body">
                <ng-content select="[panel-body]"></ng-content>
            </div>

            <div class="slide-panel__footer">
                <div class="slide-panel__footer__content">
                    <ng-content select="panel-footer"></ng-content>
                </div>
            </div>
        </div>
    `,
    styleUrls: ['./slide-panel.component.scss'],
})
export class SlidePanelComponent implements AfterViewInit {

    private _isOpen:boolean;
    @Input() title: string;

    get isOpen(): boolean {
        return this._isOpen;
    }

    @Input()
    set isOpen(value: boolean) {
        this._isOpen = value;
    }

    @Output() closeSlidePanel:EventEmitter<any> = new EventEmitter();

    ngAfterViewInit(): void {
        // this._contentContainer.scrollTop = 0;
    }

    closePanel() {
        this.isOpen = false;
        this.closeSlidePanel.emit({msg: "drawer closed"});
    }
}
