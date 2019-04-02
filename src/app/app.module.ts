import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsDatepickerModule, BsLocaleService  } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule }  from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// used to create fake backend
import { fakeBackendProvider } from './_helpers';

import { AppComponent } from './app.component';
import { routing } from './app.routing';

import { AlertComponent, DatePanelComponent,SlidePanelComponent } from './_components';
import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import {AdminComponent} from "./admin";

@NgModule({
    imports: [
        BrowserModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        HttpClientModule,
        routing
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        AdminComponent,
        HomeComponent,
        LoginComponent,
        DatePanelComponent,
        SlidePanelComponent,
        RegisterComponent
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

        // provider used to create fake backend
        fakeBackendProvider
    ],
    bootstrap: [AppComponent]
})

export class AppModule { }