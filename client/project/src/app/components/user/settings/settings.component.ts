import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
})
export class SettingsComponent implements OnDestroy {
  subs_param: Subscription;
  subs_userdata!: Subscription;
  subs_userdata2!: Subscription;
  userName!: string;
  userId!: string;
  userData!: USerData;
 

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _userService: UserService,
    private _mainService: MainService,
    private _router: Router
  ) {
    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      if (param['id'] && param['username']) {
        const username = param['username'];
        const userId = param['id'];
        this.subs_userdata = this._userService.getUserData(username).subscribe(
          (dataWithName) => {
            this._mainService.getUserData(userId).subscribe(
              (dataWithId) => {
                if (dataWithId._id === dataWithName._id) {
                  this.userName = dataWithId.full_name;
                  this.userId = dataWithId._id;
                  this.userData = dataWithId;
                } else {
                  this._router.navigate(['**']);
                }
              },
              (err) => {
                this._router.navigate(['**']);
              }
            );
          },
          (err) => {
            this._router.navigate(['**']);
          }
        );
      } else {
        this._router.navigate(['**']);
      }
    });
  }

  ngOnDestroy(): void {
    this.subs_param?.unsubscribe();
    this.subs_userdata?.unsubscribe();
    this.subs_userdata2?.unsubscribe();
  }
}
