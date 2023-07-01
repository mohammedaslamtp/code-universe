import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserService } from './services/user.service';
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

import {
  downloadCodesReducer,
  loginReducer,
  registerReducer,
  searchReducer,
} from './stores/reducer';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HomeComponent } from './components/user/home/home.component';
import { GuestHomeComponent } from './components/user/guest-home/guest-home.component';
import { OtpComponent } from './components/user/otp/otp.component';
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
import { SocialService } from './services/soical.service';
import { DownloadService } from './services/download.service';
import { CoreModule } from './modules/core/core.module';
import { SettingsComponent } from './components/user/settings/settings.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    GuestHomeComponent,
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
    SettingsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    BrowserAnimationsModule,
    SharedModule,
    StoreModule.forRoot({}, {}),
    StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: !isDevMode() }),
    EffectsModule.forRoot([]),
    EffectsModule.forFeature(effects),
    StoreModule.forFeature('loginData', loginReducer),
    StoreModule.forFeature('registerData', registerReducer),
    StoreModule.forFeature('search', searchReducer),
    StoreModule.forFeature('downloadCode', downloadCodesReducer),
  ],
  providers: [
    UserService,
    SocialService,
    SocketService,
    MainService,
    DownloadService,
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
