import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';

export const allCodesPage = new BehaviorSubject<boolean>(false);
export const publicPage = new BehaviorSubject<boolean>(false);
export const privatePage = new BehaviorSubject<boolean>(false);
export const Name = new BehaviorSubject<string | null>('');
export const Id = new BehaviorSubject<string | null>('');

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnDestroy {
  _allCodes: boolean = false;
  _popular: boolean = false;
  _public: boolean = false;
  _private: boolean = false;
  subs_allCodesPage!: Subscription;
  subs_pageRoutes!: Subscription;
  subs_owner: Subscription;
  subs_param!: Subscription;
  subs_userid!: Subscription;
  accountOwnerData!: USerData;
  userData!: USerData;
  userName!: string;
  userId!: string;
  isAccountOwner: boolean = true;
  followersCount!: number;
  followingCount!: number;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    // for representing child routes
    allCodesPage.subscribe((val) => (this._allCodes = val));
    publicPage.subscribe((val) => (this._public = val));
    privatePage.subscribe((val) => (this._private = val));

    this.subs_owner = this._userService.getUserData().subscribe(
      (data) => {
        this.followersCount = data.followers.length;
        this.followingCount = data.following.length;
        this.accountOwnerData = data;
        this.userId = data._id;
        // checking who ownes profile
        this.subs_param = this._activatedRoute.params.subscribe((param) => {
          if (param['username']) {
            const username = param['username'];
            this.subs_userid = this._userService
              .getUserData(username)
              .subscribe((data) => {
                this.followersCount = data.followers.length;
                this.followingCount = data.following.length;
                this.userData = data;
                this.userId = data._id;
              });
            Name.next(username);
            Name.subscribe((val: any) => (this.userName = val));
            if (username == this.accountOwnerData.full_name) {
              this.isAccountOwner = true;
            } else {
              this.isAccountOwner = false;
            }
          }
        });
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );
  }

  ngOnDestroy(): void {
    this.subs_owner.unsubscribe();
    this.subs_param?.unsubscribe();
    this.subs_userid?.unsubscribe();
    if (this.subs_pageRoutes) this.subs_pageRoutes.unsubscribe();
  }
}
