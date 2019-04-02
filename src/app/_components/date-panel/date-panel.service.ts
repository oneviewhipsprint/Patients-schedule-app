import {Injectable} from "@angular/core"

@Injectable()

export class dateService {
    /*list: any[] = [
        {name: "slot 1", id: "1"},
        {name: "slot 2", id: "2", bookId: "0"},
        {name: "slot 3", id: "3"},
        {name: "slot 4", id: "4"},
        {name: "slot 5", id: "5"},
    ];*/

    schedule  = [
        {
            'shiftName': 'Shift2' ,
            'chair': 'Chair1',
            'shiftId': 124,
            'patientId': '1'
        },
        {
            'shiftName': 'Shift3',
            'chair': 'Chair1',
            'shiftId': 125,
            'patientId': '2'
        },
        {
            'shiftName': 'Shift2',
            'shiftId': 124,
            'chair': 'Chair2',
            'patientId': '1'
        },
        {
            'shiftName': 'Shift3' ,
            'chair': 'Chair3',
            'shiftId': 125,
            'patientId': '2'
        }
    ];
    lists  = {
        'chairs': [{
            'chairName':'chair1',
            'chairId':'123'
        }, {
            'chairName':'chair2',
            'chairId':'124'
        }, {
            'chairName':'chair3',
            'chairId':'125'
        }],
        'shifts': [{
            'shiftName':'Shift1',
            'shiftId':'1'
        }, {
            'shiftName':'Shift2',
            'shiftId':'2'
        }, {
            'shiftName':'Shift3',
            'shiftId':'3'
        }]
    };

    getList() {
        return this.lists;
    }

    getSchedule() {
        return this.schedule;
    }
}


