import {Component, OnInit, OnDestroy} from '@angular/core';
import {Subscription} from 'rxjs';
import {first} from 'rxjs/operators';

import {Clinic, User} from '@app/_models';
import {UserService, AuthenticationService, SchedulesService, AlertService} from '@app/_services';
import {Schedule, WaitList} from "@app/_models/schedules-models";

@Component({templateUrl: 'home.component.html'})
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
                private alertService: AlertService) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
            this.scheduleService.getClinic(1).subscribe((clinic: Clinic) => {
                // console.log("clinic" + JSON.stringify(clinic));
                this.clinic = clinic;
                this.alertService.success("we have your waiting list slot available for date,please click on date to book it","04-03-2019");
            });

            this.alertService.subscribeToAlertLink().subscribe((data) => {
                if(data) {
                    this.onDateSelected(data);
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
            this.loadAllUsers()
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

    onDateSelected(event: any) {
        console.log("selected date" + event);
        this.scheduleService.getSchedules("04032019").subscribe((schedule) => {
            console.log("Schedules" + JSON.stringify(schedule));
            this.schedules = schedule;
            this.togglePanel = true;
        });
    }

    addToWaitList() {
        const waitList: WaitList = this.schedules[0];
        waitList.status = 'pending';
        this.scheduleService.addToWaitList("1", waitList).subscribe((schedule) => {
            console.log("added to wait list succesfully");
        });
    }

    cancelSchedule() {
        this.scheduleService.cancelSchedule("5", this.schedules[0].scheduleId).subscribe((schedule) => {
            console.log("canceled succesfully");
        });
    }

    bookSchedule() {
        this.scheduleService.bookSchedule("1", this.schedules[0]).subscribe((schedule) => {
            console.log("Booked succesfully");
        });
    }
}