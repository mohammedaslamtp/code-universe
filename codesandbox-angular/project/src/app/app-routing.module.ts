import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HomeComponent } from './components/user/home/home.component';
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
import {
  UserProfileComponent,
  allCodesPage,
} from './components/user/user-profile/user-profile.component';
import { SearchResultComponent } from './components/search-result/search-result.component';
import { FollowersComponent } from './components/user/followers/followers.component';
import { FollowingComponent } from './components/user/following/following.component';
import { AllCodesComponent } from './components/user/all-codes/all-codes.component';
import { PrivateCodesComponent } from './components/user/private-codes/private-codes.component';
import { PublicCodesComponent } from './components/user/public-codes/public-codes.component';
import { YourWorksComponent } from './components/user/your-works/your-works.component';
import { TrendingComponent } from './components/user/trending/trending.component';
import { FollowingCodesComponent } from './components/user/following-codes/following-codes.component';

const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
    children: [
      {
        path: '',
        component: TrendingComponent,
        canActivate: [BlockUserGuard],
      },
      {
        path: 'trending',
        component: TrendingComponent,
        canActivate: [BlockUserGuard],
      },
      {
        path: 'followingCodes',
        component: FollowingCodesComponent,
        canActivate: [BlockUserGuard],
      },
      {
        path: 'yourWorks',
        component: YourWorksComponent,
        canActivate: [BlockUserGuard],
      },
    ],
  },
  { path: '', component: GuestHomeComponent, canActivate: [GuestUserGuard] },
  { path: 'login', component: LoginComponent, canActivate: [AuthUserGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthUserGuard] },
  {
    path: 'user/otp',
    component: OtpComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
  },
  {
    path: 'coding',
    component: GuestCodingComponent,
    canDeactivate: [CodingGuard],
    // canActivate: [BlockUserGuard],
  },
  {
    path: 'liveCoding',
    component: LiveCodingComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
  },
  {
    path: 'userProfile/:username',
    component: UserProfileComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
    children: [
      { path: '', component: AllCodesComponent, canActivate: [BlockUserGuard] },
      {
        path: 'allCodes/:id',
        component: AllCodesComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
      {
        path: 'followers/:id',
        component: FollowersComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
      {
        path: 'following/:id',
        component: FollowingComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
      {
        path: 'private/:id',
        component: PrivateCodesComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
      {
        path: 'public/:id',
        component: PublicCodesComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
    ],
  },
  {
    path: 'search/:q',
    component: SearchResultComponent,
    canActivate: [BlockUserGuard],
  },
  { path: '404', component: NotFoundComponent },
  {
    path: 'admin',
    loadChildren: () =>
      import('../../modules/admin/admin.module').then((m) => m.AdminModule),
  },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
