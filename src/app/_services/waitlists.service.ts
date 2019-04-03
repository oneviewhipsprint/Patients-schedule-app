import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from "rxjs/index";
import {Clinic, Schedule} from "@app/_models";
import {WaitList} from "@app/_models/schedules-models";

@Injectable({providedIn: 'root'})
export class WaitlistsService {
    constructor(private http: HttpClient) {
    }

    getWaitLists(patientId: string, date: string): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(`${environment.apiUrl}/v1/patients/` + patientId + `/waitLists/` + date);
    }

    addToWaitList(patientId: string, waitList: WaitList): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/v1/patients/` + patientId + `/waitLists`, waitList);
    }

}
