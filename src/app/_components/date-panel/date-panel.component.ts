import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {dateService} from "./date-panel.service";

@Component({
  selector: 'app-date-panel',
  templateUrl: './date-panel.component.html',
  styleUrls: ['./date-panel.component.scss'],
  providers: [dateService]
})
export class DatePanelComponent {
  value: any;
  isOpen = true;
  showMsg: boolean = false;
  bookList: any[] = [];
  cancelList: any[] = [];
  list: any[];
  disabledDates: any[];

  Msg: boolean = false;
  @Output() dateSelected:EventEmitter<any> = new EventEmitter();

  onDateChange(event) {
    this.value = event;
    this.dateSelected.emit({selectedDate: this.value})
    console.log(this.value);
  }

}

