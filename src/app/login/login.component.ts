import {Component, OnInit} from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {first} from 'rxjs/operators';

import {AlertService, AuthenticationService, UserService} from '@app/_services';
import {User} from '@app/_models';

@Component({templateUrl: 'login.component.html'})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  users: User[] = [];

  constructor(private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authenticationService: AuthenticationService,
              private userService: UserService,
              private alertService: AlertService) {
    // redirect to home if already logged in
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.setupPatients();
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.username.value, this.f.password.value)
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate([this.returnUrl]);
        },
        error => {
          this.alertService.error(error);
          this.loading = false;
        });
  }

  setupPatients() {
    localStorage.clear();
    const user: User = {};
    user.firstName = 'Gerry';
    user.id = '1';
    user.lastName = 'Garcia';
    user.password = 'davita';
    user.username = 'gerrygarcia';
    this.users.push(user);
    const user2: User = {};
    user2.firstName = 'Jim';
    user2.id = '2';
    user2.lastName = 'Morrison';
    user2.password = 'davita';
    user2.username = 'jimmorrison';
    this.users.push(user2);
    const user3: User = {};
    user3.firstName = 'Janis';
    user3.id = '3';
    user3.lastName = 'Joplin';
    user3.password = 'davita';
    user3.username = 'janisjoplin';
    this.users.push(user3);
    const user4: User = {};
    user4.firstName = 'hhelderman';
    user4.id = '4';
    user4.lastName = 'J';
    user4.password = 'davita';
    user4.username = 'hhelderman';
    user4.isAdmin = true;
    this.users.push(user4);
    const user5: User = {};
    user5.firstName = 'Freddy';
    user5.id = '5';
    user5.lastName = 'Mercury';
    user5.password = 'davita';
    user5.username = 'fremercury';
    this.users.push(user5);
    localStorage.setItem('users', JSON.stringify(this.users));
  }
}
