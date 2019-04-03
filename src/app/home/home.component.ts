import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import * as moment from 'moment/moment';
import {Clinic, User} from '@app/_models';
import {UserService, AuthenticationService, SchedulesService, AlertService} from '@app/_services';
import {Schedule, WaitList} from "@app/_models/schedules-models";
import {NotificationsService} from "@app/_services/notifications.service";
import {WaitlistsService} from '@app/_services/waitlists.service';

@Component({templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    togglePanel: boolean;
    users: User[] = [];
    schedules: Schedule[] = [];
    waitLists: WaitList[] = [];
    clinic: Clinic = {};
    selectedDate: string;

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

    onPanelClose() {
        this.selectedDate = "";
        this.togglePanel = false;
    }

    onDateSelected(event: any, date?:string) {
        this.selectedDate = date ? date : moment(event.selectedDate).format("YYYY-MM-DD");
        this.getSchedules(this.selectedDate);
    }

    private getSchedules(selectedDate: string) {
        this.scheduleService.getSchedules(selectedDate).subscribe((schedule) => {
            console.log("Schedules" + JSON.stringify(schedule));
            this.schedules = schedule;
            this.waitListsService.getWaitLists(this.currentUser.id, selectedDate).subscribe((waitLists) => {
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
        waitList.patientId = this.currentUser.id;
        waitList.shiftDate = schedule.shiftDate;

        waitList.status = 'pending';
        this.scheduleService.addToWaitList(this.currentUser.id, waitList).subscribe((schedule) => {
            const msg = 'added to wait list succesfully';
            this.alertService.success(msg);
            this.getSchedules(this.selectedDate);
            });
    }
    cancelSchedule(scheduleId: string) {
        this.scheduleService.cancelSchedule(this.currentUser.id, scheduleId).subscribe((schedule) => {
           const msg ='canceled Successfully';
            this.alertService.success(msg);
            this.getSchedules(this.selectedDate);
            });
    }
    bookSchedule(schedule: Schedule) {
        this.scheduleService.bookSchedule(this.currentUser.id, schedule).subscribe((schedule) => {
            const msg ='Booked succesfully';
            this.alertService.success(msg);
            this.getSchedules(this.selectedDate);
        });
    }

    isAlreadyWaitListed(shiftId: any, chairId: any): boolean {
        const matchingKey = this.waitLists.findIndex(waitList => waitList.shiftId === shiftId && waitList.chairId === chairId);
        return matchingKey > -1; // convert to boolean.
    }
}
