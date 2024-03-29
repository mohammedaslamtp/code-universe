import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SocialService } from 'src/app/services/soical.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import Swal from 'sweetalert2';
import { userProfile } from '../user-header/user-header.component';
import { domain } from 'src/app/services/shared-values.service';
import { Title } from '@angular/platform-browser';

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
  displayName!: string;
  userId!: string;
  profilePath!: string;
  isAccountOwner: boolean = true;
  followersCount!: number;
  followingCount!: number;
  location: string | null = null;
  bio: string | null = null;
  github: string = 'https://github.com';
  linkedIn: string = 'https://in.linkedin.com';
  isFollowing: boolean = false;
  constructor(
    private _userService: UserService,
    private _socialService: SocialService,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _titleService: Title
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
                  this.displayName = data.display_name;
                  this.userId = data._id;
                  if (data.location !== null || data.location !== '') {
                    this.location = data.location;
                  }
                  if (data.bio !== null || data.bio !== '') {
                    this.bio = data.bio;
                  }
                  if (data.avatar) {
                    this.profilePath = `${domain}/${data.avatar}`;
                  } else {
                    this.profilePath =
                      '../../../../assets/images/defulat_profile_avatar_of_codebox_2023.png';
                  }
                  if (data.github_link) {
                    this.github = data.github_link;
                  }
                  if (data.linkedin_link) {
                    this.linkedIn = data.linkedin_link;
                  }

                  Name.next(data.full_name);
                  this.checkingIsFollowed();
                },
                (e) => {
                  this._router.navigate(['**']);
                }
              );
            Name.subscribe((val: any) => (this.userName = val));
            if (username == this.accountOwnerData.full_name) {
              this.userName = this.accountOwnerData.full_name;
              this._titleService.setTitle(this.accountOwnerData.display_name);
              this.isAccountOwner = true;
              userProfile.next(true);
            } else {
              userProfile.next(false);
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
            showCloseButton: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'error',
            title: 'Something went wrong!',
          });
        }
      );
  }

  ngOnDestroy(): void {
    setTimeout(() => {
      userProfile.next(false);
    }, 0);
    this.isAccountOwner = false;
    this.subs_owner?.unsubscribe();
    this._titleService.setTitle('CODEBOX');
    this.subs_param?.unsubscribe();
    this.subs_userid?.unsubscribe();
    this.subs_follow?.unsubscribe();
    this.subs_unfollow?.unsubscribe();
    this.subs_pageRoutes?.unsubscribe();
  }
}
