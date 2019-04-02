import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {dateService} from "./date-panel.service";
@Component({
  selector: 'app-date-panel',
  templateUrl: './date-panel.component.html',
  styleUrls: ['./date-panel.component.css'],
  providers: [dateService]
})
export class DatePanelComponent implements OnInit {
  value: any;
  bookList: any[] = [];
  cancelList: any[] = [];
  lists: any;
  schdule:any[];
  chairInfo: any;
  slotInfo: any;
  constructor(private _dateService:dateService) {
  }

  ngOnInit() {
    this.fetchData(new Date());
  }
  fetchData(date) {
    this.lists = this._dateService.getList();
  }
  onClick(col, shift) {
    this.chairInfo = col;
    this.slotInfo = shift;
    console.log(this.chairInfo);
    console.log(this.slotInfo);

  }
  onDateChange(event) {
    this.value = event;
    // this.fetchData(this.value);
    this.schdule = this._dateService.getSchedule();
  }
  isActionDisabled(col, shift) {
    for(const item of this.schdule) {
      if (item.shiftName.toLowerCase() === shift.shiftName.toLowerCase() && item.chair.toLowerCase() === col.chairName.toLowerCase()) {
        return false;
      }
    }
    return true;
  }
}

