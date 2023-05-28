import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserService } from './services/user.service';
import { AdminService } from './services/admin.service';
import { SocketService } from './services/socket.service';

import { AuthInterceptor } from './services/auth.interceptor';
import { AuthUserGuard } from './guard/auth-user.guard';

import { SharedModule } from 'shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './stores/effects';
import { GuestUserGuard } from './guard/guest-user.guard';
import { UserHomeGuard } from './guard/user-home.guard';
import { CodingGuard } from './guard/coding.guard';
import { BlockUserGuard } from './guard/block-user.guard';

import { loginReducer, registerReducer } from './stores/reducer';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HomeComponent } from './components/user/home/home.component';
import { GuestHomeComponent } from './components/user/guest-home/guest-home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AdLoginComponent } from './components/admin/ad-login/ad-login.component';
import { OtpComponent } from './components/user/otp/otp.component';
import { HeaderComponent } from './components/admin/header/header.component';
import { UserHeaderComponent } from './components/user/user-header/user-header.component';
import { NotFoundComponent } from './components/user/not-found/not-found.component';
import { GuestCodingComponent } from './components/user/guest-coding/guest-coding.component';
import { PopupLoginComponent } from './components/popup-login/popup-login.component';
import { PopupSignupComponent } from './components/popup-signup/popup-signup.component';
import { GenerateOtpComponent } from './components/user/generate-otp/generate-otp.component';
import { OtpVeriyAlertComponent } from './components/user/otp-veriy-alert/otp-veriy-alert.component';
import { LiveCodingComponent } from './components/user/live-coding/live-coding.component';
import { UserProfileComponent } from './components/user/user-profile/user-profile.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { MainService } from './services/main.service';


// quill api
// import { QuillModule } from 'ngx-quill';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    GuestHomeComponent,
    DashboardComponent,
    HeaderComponent,
    UsersComponent,
    AdLoginComponent,
    OtpComponent,
    UserHeaderComponent,
    NotFoundComponent,
    GuestCodingComponent,
    PopupLoginComponent,
    PopupSignupComponent,
    GenerateOtpComponent,
    OtpVeriyAlertComponent,
    LiveCodingComponent,
    UserProfileComponent,
    SearchResultComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    // QuillModule.forRoot(),
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
    SocketService,
    MainService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AuthUserGuard,
    GuestUserGuard,
    UserHomeGuard,
    CodingGuard,
    BlockUserGuard,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
