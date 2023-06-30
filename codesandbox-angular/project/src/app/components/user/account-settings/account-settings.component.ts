import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.css']
})
export class AccountSettingsComponent {
  subs_param: Subscription;
  subs_userdata!: Subscription;
  userName!: string;
  userId!: string;
  userData!: USerData;
  subs_ownerData!: Subscription;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _mainService: MainService,
    private _settingsService: SettingsService,
    private _router: Router
  ) {
    console.log('working..')
    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      console.log(param)
      if (param['id'] && param['username']) {
        const username = param['username'];
        const userId = param['id'];
        // this.subs_userdata = this._userService.getUserData(username).subscribe(
        //   (dataWithName) => {
        //     this.subs_ownerData = this._mainService
        //       .getUserData(userId)
        //       .subscribe(
        //         (dataWithId) => {
        //           if (dataWithId._id === dataWithName._id) {
        //             this.userName = dataWithId.full_name;
        //             this.userId = dataWithId._id;
        //             this.userData = dataWithId;
        //           } else {
        //             this._router.navigate(['**']);
        //           }
        //         },
        //         (err) => {
        //           this._router.navigate(['**']);
        //         }
        //       );
        //   },
        //   (err) => {
        //     this._router.navigate(['**']);
        //   }
        // );
        console.log('username: ',username)
        console.log('id ',userId)
      }
    });
  }
}
