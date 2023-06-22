import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CoreModule } from 'src/app/modules/core/core.module';
import { SocialService } from 'src/app/services/soical.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import Swal from 'sweetalert2';
import { UserHeaderComponent } from '../user-header/user-header.component';

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
  isFollowing: boolean = false;
  constructor(
    private _userService: UserService,
    private _socialService: SocialService,
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
              .subscribe(
                (data) => {
                  this.followersCount = data.followers.length;
                  this.followingCount = data.following.length;
                  this.userData = data;
                  this.userId = data._id;
                  Name.next(data.full_name);
                  this.checkingIsFollowed();
                },
                (e) => {
                  this._router.navigate(['**']);
                }
              );
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

  // to check is followed
  checkingIsFollowed() {
    if (this.userData && this.userData?.followers.length > 0) {
      this.userData.followers.forEach((el) => {
        if (el == this.accountOwnerData._id) {
          this.isFollowing = true;
        } else {
          this.isFollowing = false;
        }
      });
    } else {
      this.isFollowing = false;
    }
  }

  subs_follow!: Subscription;
  followingLoading: boolean = false;
  onFollow() {
    this.followingLoading = true;
    this.subs_follow = this._socialService.follow(this.userData._id).subscribe(
      (data) => {
        this.followingLoading = false;
        this.followersCount = data.followers.length;
        this.followingCount = data.following.length;
        this.userData = data;
        this.checkingIsFollowed();
      },
      (e) => {
        this.checkingIsFollowed();
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2500,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Please check your network!',
        });
      }
    );
  }

  subs_unfollow!: Subscription;
  unFollowingLoading: boolean = false;
  onUnFollow() {
    this.unFollowingLoading = true;
    this.subs_unfollow = this._socialService
      .unFollow(this.userData._id)
      .subscribe(
        (data) => {
          this.unFollowingLoading = false;
          this.followersCount = data.followers.length;
          this.followingCount = data.following.length;
          this.userData = data;
          this.checkingIsFollowed();
        },
        (e) => {
          this.checkingIsFollowed();
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'error',
            title: 'Please check your network!',
          });
        }
      );
  }

  ngOnDestroy(): void {
    this.isAccountOwner = false;
    this.subs_owner.unsubscribe();
    this.subs_param?.unsubscribe();
    this.subs_userid?.unsubscribe();
    this.subs_follow?.unsubscribe();
    this.subs_unfollow?.unsubscribe();
    this.subs_pageRoutes?.unsubscribe();
  }
}
