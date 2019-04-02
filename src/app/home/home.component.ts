import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';
import * as moment from 'moment/moment';
import {Clinic, User} from '@app/_models';
import {UserService, AuthenticationService, SchedulesService, AlertService} from '@app/_services';
import {Schedule, WaitList} from "@app/_models/schedules-models";
import {NotificationsService} from "@app/_services/notifications.service";

@Component({templateUrl: 'home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    currentUser: User;
    currentUserSubscription: Subscription;
    togglePanel: boolean;
    users: User[] = [];
    schedules: Schedule[] = [];
    clinic: Clinic = {};

    constructor(private authenticationService: AuthenticationService,
                private userService: UserService,
                private scheduleService: SchedulesService,
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
               if(this.currentUser.id === data.patientId) {
                    const date: string = "" + data.shiftDate.toString();
                    const message: string = "" + data.text.toString();
                    this.alertService.success(message, date);
               }
            })
        });
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    ngOnDestroy() {
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
        this.togglePanel = false;
    }

    onDateSelected(event: any, date?:string) {
        const selectedDate = date ? date : moment(event.selectedDate).format("YYYY-MM-DD");
        this.scheduleService.getSchedules(selectedDate).subscribe((schedule) => {
            console.log("Schedules" + JSON.stringify(schedule));
            this.schedules = schedule;
            this.togglePanel = true;
        });
    }

    addToWaitList(schedule: Schedule) {
        const waitList: WaitList = schedule;
        waitList.status = 'pending';
        this.scheduleService.addToWaitList(this.currentUser.id, waitList).subscribe((schedule) => {
            console.log("added to wait list succesfully");
        });
    }
    cancelSchedule(scheduleId: string) {
        this.scheduleService.cancelSchedule(this.currentUser.id, scheduleId).subscribe((schedule) => {
            console.log("canceled succesfully");
        });
    }
    bookSchedule(schedule: Schedule) {
        this.scheduleService.bookSchedule(this.currentUser.id, schedule).subscribe((schedule) => {
            console.log("Booked succesfully");
        });
    }
}