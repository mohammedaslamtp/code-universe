import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { AuthUserGuard } from './guard/auth-user.guard';
import { GuestHomeComponent } from './components/user/guest-home/guest-home.component';
import { OtpComponent } from './components/user/otp/otp.component';
import { GuestUserGuard } from './guard/guest-user.guard';
import { UserHomeGuard } from './guard/user-home.guard';
import { NotFoundComponent } from './components/user/not-found/not-found.component';
import { GuestCodingComponent } from './components/user/guest-coding/guest-coding.component';
import { CodingGuard } from './guard/coding.guard';
import { BlockUserGuard } from './guard/block-user.guard';
import { LiveCodingComponent } from './components/user/live-coding/live-coding.component';

import { SearchResultComponent } from './components/search-result/search-result.component';
import { CreateLiveComponent } from './components/user/create-live/create-live.component';
import { LiveCodingGuard } from './guard/live-coding.guard';
import { IsValidLiveGuard } from './guard/is-valid-live.guard';
import { SearchingComponent } from './components/searching/searching.component';
import { OverallViewComponent } from './components/user/overall-view/overall-view.component';
// import { CanDeactivateGuard } from './guard/live-coding.guard';

const routes: Routes = [
  { path: '', component: GuestHomeComponent, canActivate: [GuestUserGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthUserGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthUserGuard] },
  {
    path: 'user/otp',
    component: OtpComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
  },
  {
    path: 'coding/:id',
    component: GuestCodingComponent,
    canDeactivate: [CodingGuard],
  },
  {
    path: 'createLive',
    component: CreateLiveComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
  },
  {
    path: 'liveCoding/:room',
    component: LiveCodingComponent,
    canActivate: [UserHomeGuard, BlockUserGuard, IsValidLiveGuard],
    canDeactivate: [LiveCodingGuard],
  },

  {
    path: 'overallView/:id',
    component: OverallViewComponent,
    canActivate: [UserHomeGuard, BlockUserGuard]
  },

  // auth user
  {
    path: 'search/:q',
    component: SearchResultComponent,
    canActivate: [BlockUserGuard],
  },

  // guest user
  {
    path: 'guest/search',
    component: SearchingComponent,
  },

  { path: '404', component: NotFoundComponent },
  {
    path: 'userProfile/:username',
    loadChildren: () =>
      import('./modules/user-profile/user-profile.module').then(
        (m) => m.UserProfileModule
      ),
  },
  {
    path: 'home',
    loadChildren: () =>
      import('./modules/user-home/user-home.module').then(
        (m) => m.UserHomeModule
      ),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
