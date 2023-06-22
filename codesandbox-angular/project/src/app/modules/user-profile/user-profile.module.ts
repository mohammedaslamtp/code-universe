import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthAdminGuard } from 'src/app/admin_guard/auth-admin.guard';
import { VerifyAdminGuard } from 'src/app/admin_guard/verify-admin.guard';
import { NotFoundComponent } from 'src/app/components/user/not-found/not-found.component';
import { CoreModule } from '../core/core.module';
import { UserService } from 'src/app/services/user.service';
import { UserProfileComponent } from 'src/app/components/user/user-profile/user-profile.component';
import { AllCodesComponent } from 'src/app/components/user/all-codes/all-codes.component';
import { FollowersComponent } from 'src/app/components/user/followers/followers.component';
import { FollowingComponent } from 'src/app/components/user/following/following.component';
import { PrivateCodesComponent } from 'src/app/components/user/private-codes/private-codes.component';
import { PublicCodesComponent } from 'src/app/components/user/public-codes/public-codes.component';
import { BlockUserGuard } from 'src/app/guard/block-user.guard';
import { UserHomeGuard } from 'src/app/guard/user-home.guard';
import { MainService } from 'src/app/services/main.service';
import { SocialService } from 'src/app/services/soical.service';
import { CodemirrorModule } from '@ctrl/ngx-codemirror';

const userProfileRoutes: Routes = [
  {
    path: '',
    component: UserProfileComponent,
    canActivate: [UserHomeGuard, BlockUserGuard],
    children: [
      {
        path: '',
        component: AllCodesComponent,
        canActivate: [UserHomeGuard, BlockUserGuard],
      },
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
      { path: '404', component: NotFoundComponent },
      { path: '**', redirectTo: '/404' },
    ],
  },
];

@NgModule({
  declarations: [
    AllCodesComponent,
    PublicCodesComponent,
    PrivateCodesComponent,
    FollowersComponent,
    FollowingComponent,
  ],
  imports: [
    CoreModule,
    CodemirrorModule,
    RouterModule.forChild(userProfileRoutes),
  ],
  exports: [CoreModule],
  providers: [
    AuthAdminGuard,
    VerifyAdminGuard,
    UserService,
    MainService,
    SocialService,
  ],
})
export class UserProfileModule {}
