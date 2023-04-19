import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { AuthInterceptor } from './services/auth.interceptor';
import { AuthUserGuard } from './guard/auth-user.guard';
import { SharedModule } from 'shared/shared.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HomeComponent } from './components/user/home/home.component';
import { GuestHomeComponent } from './components/user/guest-home/guest-home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { HeaderComponent } from './components/admin/header/header.component';
import { AdLoginComponent } from './components/admin/ad-login/ad-login.component';
import { OtpComponent } from './components/user/signup/otp/otp.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './stores/effects';
import { loginReducer, registerReducer } from './stores/reducer';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    GuestHomeComponent,
    DashboardComponent,
    UsersComponent,
    HeaderComponent,
    AdLoginComponent,
    OtpComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('loginData', loginReducer),
    StoreModule.forFeature('registerData', registerReducer),
  ],
  providers: [
    UserService,
    AdminService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthUserGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
