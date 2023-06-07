import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css'],
})
export class UserProfileComponent implements OnDestroy {
  subs_owner: Subscription;
  subs_param!: Subscription;
  accountOwnerData!: USerData;
  userName!: string;
  userId!: string;
  isAccountOwner: boolean = true;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    // getting user data
    this.subs_owner = this._userService.getUserData().subscribe((data) => {
      this.accountOwnerData = data;
      this.userId = data._id;
      // checking who ownes profile
      this.subs_param = this._activatedRoute.params.subscribe((param) => {
        const username = param['username'];
        console.log(param);
        this.userName = username;
        if (username == this.accountOwnerData.full_name) { 
          this.isAccountOwner = true;
        } else {
          this.isAccountOwner = false;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.subs_owner.unsubscribe();
    this.subs_param.unsubscribe();
  }
}
