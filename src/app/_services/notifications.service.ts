import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, Observer} from "rxjs/index";
import * as socketIo from 'socket.io-client';

export interface Socket {
    on(event: string, callback: (data: any) => void );
    emit(event: string, data: any);
}

@Injectable({providedIn: 'root'})
export class NotificationsService{

    socket: Socket;
    observer: Observer<number>;
    constructor(private http: HttpClient) {
    }

    getNotifications() : Observable<number> {
        this.socket = socketIo('http://localhost:3555');
        this.socket.on('data', (res) => {
            console.log("data from kafka"+ JSON.stringify(res));
            this.observer.next(JSON.parse(res.data.value));
        });
        return this.createObservable();
    }

    createObservable() : Observable<number> {
        return new Observable<number>(observer => {
            this.observer = observer;
        });
    }
}