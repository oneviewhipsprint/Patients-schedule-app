import {Component, Input, OnInit} from '@angular/core';

@Component({
    selector: 'app-table',
    templateUrl: './table.component.html',

})

export class TableComp {

    @Input() clinic: any = {};
    @Input() schedules: any = [];

    isActionDisabled(col, shift) {
        for (const item of this.schedules) {
            if (item.shiftName.toLowerCase() === shift.shiftName.toLowerCase()
                && item.chair.toLowerCase() === col.chairName.toLowerCase()) {
                return false;
            }
        }
        return true;
    }


}