import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FollowingCodesComponent } from 'src/app/components/user/following-codes/following-codes.component';
import { HomeComponent } from 'src/app/components/user/home/home.component';
import { TrendingComponent } from 'src/app/components/user/trending/trending.component';
import { YourWorksComponent } from 'src/app/components/user/your-works/your-works.component';
import { BlockUserGuard } from 'src/app/guard/block-user.guard';
import { UserHomeGuard } from 'src/app/guard/user-home.guard';
import { CoreModule } from '../core/core.module';
import { NotFoundComponent } from 'src/app/components/user/not-found/not-found.component';

const userHomeRoutes: Routes = [
  {
    path: '',
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
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  declarations: [
    TrendingComponent,
    FollowingCodesComponent,
    YourWorksComponent,
  ],
  imports: [CoreModule, RouterModule.forChild(userHomeRoutes)],
  exports: [CoreModule],
  providers: [UserHomeGuard, BlockUserGuard],
})
export class UserHomeModule {}
