import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {BsDatepickerConfig} from "ngx-bootstrap/datepicker";
import {dateService} from "./date-panel.service";

@Component({
  selector: 'app-date-panel',
  templateUrl: './date-panel.component.html',
  styleUrls: ['./date-panel.component.scss'],
  providers: [dateService]
})
export class DatePanelComponent implements OnInit {
  value: any;
  isOpen = true;
  showMsg: boolean = false;
  bookList: any[] = [];
  cancelList: any[] = [];
  list: any[];
  Msg: boolean = false;

  constructor(private _dateService:dateService){
  }

  ngOnInit() {
    this.fetchData(new Date());
  }
  fetchData(date) {
    this.list = this._dateService.getList();
    for (const item of this.list) {
      if (item.bookId) {
        item.isBooked = true
      }
    }
  }

  book(data) {
    data.isBooked = !data.isBooked;
    if (!data.bookId) {
      if (data.isBooked) {
        this.bookList.push(data);
      } else {
        for (let i = 0; i < this.bookList.length; i++) {
          const item = this.bookList[i];
          if (item.id === data.id) {
            this.bookList.splice(i, 1);
            break;
          }
        }
      }
    } else {
      if (!data.isBooked) {
        this.cancelList.push(data);
      } else {
        for (let i = 0; i < this.cancelList.length; i++) {
          const item = this.cancelList[i];
          if (item.id === data.id) {
            this.cancelList.splice(i, 1);
            break;
          }
        }
      }
      console.log(this.cancelList)
    }
  }

  onDateChange(event) {
    this.value = event;
    this.fetchData(this.value);

  }
  submit() {
      for (const item of this.list) {
        if (item.bookId && item.isBooked) {
          return;
        }
      }
     if (this.bookList.length === 1 || this.cancelList.length === 1 ) {
     this.showMsg = false;
     console.log(this.value);
     console.log(this.bookList);
     console.log(this.cancelList);
     } else {
        this.showMsg = true;
     }
  }
  }

