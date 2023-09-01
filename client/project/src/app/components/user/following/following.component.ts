import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocialService } from 'src/app/services/soical.service';
import { USerData } from 'src/app/types/UserData';
import Swal from 'sweetalert2';
import { domain } from 'src/app/services/shared-values.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FollowingComponent implements OnInit, OnDestroy {
  constructor(
    private _socialService: SocialService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  followingData!: USerData[];
  subs_followingData!: Subscription;
  domain: string = domain;
  subs_userId!: Subscription;
  userId!: string;
  ownerData!: USerData;
  subs_ownerData!: Subscription;

  ngOnInit(): void {
    this.subs_ownerData = this._userService.getUserData().subscribe(
      (data) => {
        this.ownerData = data;
      },
      (e) => {
        this._router.navigate(['**']);
      }
    );

    this.subs_userId = this._activatedRoute.params.subscribe((p) => {
      this.userId = p['id'];
      if (p['id']) {
        this.subs_followingData = this._socialService
          .getAllFollowingUsers(p['id'])
          .subscribe((users) => {
            this.followingData = users.data;
          });
      }
    });
  }

  subs_unfollow!: Subscription;
  onUnFollow(id: string, index: number) {
    this.subs_unfollow = this._socialService.unFollow(id).subscribe(
      (data) => {
        if (data) {
          if (this.ownerData._id == this.userId) {
            this.followingData.splice(index, 1);
          }
        }
        const removeIndex = this.followingData[index].followers.indexOf(
          this.ownerData._id
        );

        this.followingData[index].followers.splice(removeIndex, 1);
      },
      (e) => {
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

  subs_follow!: Subscription;
  onFollow(user: USerData, index: number) {
    this.subs_follow = this._socialService.follow(user._id).subscribe(
      (data) => {
        if (data._id == this.userId) {
          this.followingData.push(user);
        }
        this.followingData[index].followers.push(this.ownerData._id);
      },
      (e) => {
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

  isArrInclude = (arr: Array<string>) => arr.includes(this.ownerData._id);

  ngOnDestroy(): void {
    this.subs_followingData?.unsubscribe();
    this.subs_ownerData?.unsubscribe();
    this.subs_unfollow?.unsubscribe();
  }
}
