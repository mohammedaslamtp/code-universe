import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/user/login/login.component';
import { SignupComponent } from './components/user/signup/signup.component';
import { HomeComponent } from './components/user/home/home.component';
import { AuthUserGuard } from './guard/auth-user.guard';
import { GuestHomeComponent } from './components/user/guest-home/guest-home.component';
import { DashboardComponent } from './components/admin/dashboard/dashboard.component';
import { UsersComponent } from './components/admin/users/users.component';
import { AdLoginComponent } from './components/admin/ad-login/ad-login.component';
import { OtpComponent } from './components/user/signup/otp/otp.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: '', component: GuestHomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [AuthUserGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [AuthUserGuard] },
  { path: 'user/otp', component: OtpComponent },
  {
    path: 'admin',
    children: [
      { path: '', component: DashboardComponent },
      { path: 'users', component: UsersComponent },
      { path: 'login', component: AdLoginComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
