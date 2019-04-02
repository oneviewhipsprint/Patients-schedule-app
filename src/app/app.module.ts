import { NgModule,NO_ERRORS_SCHEMA,CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BsDatepickerModule, BsLocaleService  } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
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
import {TableComp} from "@app/_components/table/table.component";

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
        TableComp,
        SlidePanelComponent,
        RegisterComponent
    ],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
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