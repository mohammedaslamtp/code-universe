import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { admin_effects } from 'admin_store/effects';
import { adminLoginReducer } from 'admin_store/reducers';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/user/not-found/not-found.component';
import { CoreModule } from '../core/core.module';
import { BlockUserGuard } from 'src/app/guard/block-user.guard';
import { UserHomeGuard } from 'src/app/guard/user-home.guard';
import { AuthAdminGuard } from 'src/app/admin_guard/auth-admin.guard';
import { VerifyAdminGuard } from 'src/app/admin_guard/verify-admin.guard';
import { AdLoginComponent } from 'src/app/components/admin/ad-login/ad-login.component';
import { DashboardComponent } from 'src/app/components/admin/dashboard/dashboard.component';
import { UsersComponent } from 'src/app/components/admin/users/users.component';
import { HeaderComponent } from 'src/app/components/admin/header/header.component';

const admin_routes: Routes = [

  { path: 'login', component: AdLoginComponent, canActivate: [AuthAdminGuard] },
  { path: '', component: DashboardComponent, canActivate: [VerifyAdminGuard] },
  { path: 'users', component: UsersComponent, canActivate: [VerifyAdminGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },


  
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '/404' },
];

@NgModule({
  declarations:[
    AdLoginComponent,
    DashboardComponent,
    HeaderComponent,
    UsersComponent,
  ],
  imports: [
    CoreModule,
    RouterModule.forChild(admin_routes),
    EffectsModule.forFeature(admin_effects),
    StoreModule.forFeature('admin', adminLoginReducer),
  ],
  exports: [CoreModule],
  providers: [UserHomeGuard, BlockUserGuard],
})
export class AdminModule {}


