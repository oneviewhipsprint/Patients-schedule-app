import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { first } from 'rxjs/operators';

import {Clinic, User} from '@app/_models';
import {UserService, AuthenticationService, AlertService, SchedulesService} from '@app/_services';
import {NotificationsService} from "@app/_services/notifications.service";
import * as moment from "moment";
import {WaitlistsService} from "@app/_services/waitlists.service";
import {Schedule, WaitList} from "@app/_models/schedules-models";

@Component({ templateUrl: 'admin.component.html',styleUrls: ['./admin.component.scss'] })
export class AdminComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    togglePanel: boolean;
    users: User[] = [];
    schedules: Schedule[] = [];
    waitLists: WaitList[] = [];
    clinic: Clinic = {};
    completeSchedules: Schedule[]=[];
    selectedDate: string;
    selectedPatient: User = {};

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private scheduleService: SchedulesService,
                private waitListsService: WaitlistsService,
                private alertService: AlertService,
                private notificationService: NotificationsService) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.scheduleService.getClinic(1).subscribe((clinic: Clinic) => {
                // console.log("clinic" + JSON.stringify(clinic));
                this.clinic = clinic;
            });

            this.alertService.subscribeToAlertLink().subscribe((data) => {
                if (data) {
                    this.onDateSelected({},data);
                }
            });

            this.notificationService.getNotifications().subscribe((data:any) => {
                if(this.currentUser.id == data.patientId) {
                    const date: string = "" + data.shiftDate.toString();
                    const message: string = "" + data.text.toString();
                    this.alertService.success(message, date, false);
                }
            })
        });
    }

    ngOnInit() {
        this.selectedDate = "";
        this.loadAllUsers();
    }

    ngOnDestroy() {
        this.selectedDate = "";
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    }

    deleteUser(id: number) {
        this.userService.delete(id).pipe(first()).subscribe(() => {
            this.loadAllUsers();
        });
    }

    private loadAllUsers() {
        this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });
    }

    selectPatient(event){
        this.selectedPatient = this.users.find( user => user.firstName === event);
        console.log("selected patient"+ JSON.stringify(this.selectedPatient));
        //this.selectedPatient = event;
    }
    onPanelClose() {
        this.selectedDate = "";
        this.togglePanel = false;
    }

    onDateSelected(event: any, date?:string) {
        this.selectedDate = date ? date : moment(event.selectedDate).format("YYYY-MM-DD");
        this.completeSchedules = this.formatSchedule();
        this.getSchedules(this.selectedDate);
    }

    private getSchedules(selectedDate: string) {
        this.scheduleService.getSchedules(selectedDate).subscribe((schedule) => {
            console.log("Orginal Schedules" + JSON.stringify(schedule));
            this.schedules = this.getCompleteSchedules(schedule);
            console.log("Schedules" + JSON.stringify(this.schedules));
            this.waitListsService.getWaitLists(this.selectedPatient.id, selectedDate).subscribe((waitLists) => {
                console.log("waitList" + JSON.stringify(waitLists));
                this.waitLists = waitLists;
                this.togglePanel = true;
            });
        });
    }

    addToWaitList(schedule: Schedule) {
        const waitList: WaitList = {};
        waitList.shiftId = schedule.shiftId;
        waitList.clinicId = schedule.clinicId;
        waitList.chairId = schedule.chairId;
        waitList.patientId = this.selectedPatient.id;
        waitList.shiftDate = schedule.shiftDate;

        waitList.status = 'pending';
        this.scheduleService.addToWaitList(this.selectedPatient.id, waitList).subscribe((schedule) => {
            const msg = 'Added to wait list succesfully';
            this.alertService.success(msg);
            this.getSchedules(this.selectedDate);
        });
    }
    cancelSchedule(scheduleId: string) {
        console.log("scheduleId"+ scheduleId);
        this.scheduleService.cancelSchedule(this.selectedPatient.id, scheduleId).subscribe((schedule) => {
            const msg ='Canceled Successfully';
            this.alertService.success(msg);
            this.completeSchedules = this.formatSchedule();
            this.getSchedules(this.selectedDate);
        });
    }
    bookSchedule(schedule: Schedule) {
        schedule.patientId = this.selectedPatient.id;
        this.scheduleService.bookSchedule(this.selectedPatient.id, schedule).subscribe((schedule) => {
            const msg ='Booked succesfully';
            this.alertService.success(msg);
            this.getSchedules(this.selectedDate);
        });
    }

    getCompleteSchedules(schedule):any[]{
        this.completeSchedules.forEach((cSchedule) => {
            schedule.forEach((schedule) => {
                if(schedule.chairId === cSchedule.chairId && schedule.shiftId === cSchedule.shiftId){
                    cSchedule.patientId = schedule.patientId;
                    cSchedule.scheduleId = schedule.scheduleId;
                    cSchedule.clinicId = schedule.clinicId;
                    cSchedule.shiftDate = schedule.shiftDate;
                }
            });
        });
        return this.completeSchedules;
    }

    formatSchedule(): any[]{
        const newArr = [];
        this.clinic.chairs.forEach((chair) => {
            this.clinic.shifts.forEach((shift) => {
                const Obj:Schedule = {
                    shiftId: shift.shiftId,
                    chairId: chair.chairId,
                    clinicId: "1",
                    shiftDate: this.selectedDate,
                    patientId: ""
                };
                newArr.push(Obj);
            });
        });
        return newArr;
    }


    isAlreadyWaitListed(shiftId: any, chairId: any): boolean {
        const matchingKey = this.waitLists.findIndex(waitList => waitList.shiftId === shiftId && waitList.chairId === chairId);
        return matchingKey > -1; // convert to boolean.
    }
}