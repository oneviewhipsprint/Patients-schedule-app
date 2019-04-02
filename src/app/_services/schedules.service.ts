import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '@environments/environment';
import {Observable} from "rxjs/index";
import {Clinic, Schedule} from "@app/_models";

@Injectable({providedIn: 'root'})
export class SchedulesService {
    constructor(private http: HttpClient) {
    }

    getClinic(clinicId: number): Observable<Clinic> {
        return this.http.get<Clinic>(`${environment.apiUrl}/v1/clinic/` + clinicId);
    }

    getSchedules(date: string): Observable<Schedule[]> {
        return this.http.get<Schedule[]>(`${environment.apiUrl}/v1/schedules/` + date);
    }

    bookSchedule(patientId: string, schedule: Schedule): Observable<Schedule[]> {
        return this.http.post<Schedule[]>(`${environment.apiUrl}/v1/patients/` + patientId + `/schedules`, schedule);
    }

    cancelSchedule(patientId: string, scheduleId: string): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/v1/patients/` + patientId + `/schedules/` + scheduleId, {});
    }

    addToWaitList(patientId: string, waitList: any): Observable<any> {
        return this.http.post<any>(`${environment.apiUrl}/v1/patients/` + patientId + `/waitList`, waitList);
    }


}