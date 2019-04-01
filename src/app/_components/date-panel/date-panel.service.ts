import {Injectable} from "@angular/core"

@Injectable()

export class dateService {
    list: any[] = [
        {name: "slot 1", id: "1"},
        {name: "slot 2", id: "2", bookId: "0"},
        {name: "slot 3", id: "3"},
        {name: "slot 4", id: "4"},
        {name: "slot 5", id: "5"},
    ];

    getList(): any[] {
        return this.list;
    }
}


