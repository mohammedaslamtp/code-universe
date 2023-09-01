import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { domain } from 'src/app/services/shared-values.service';
import { SocialService } from 'src/app/services/soical.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.css'],
})
export class FollowersComponent implements OnInit, OnDestroy {
  constructor(
    private _socialService: SocialService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {}

  followersData!: USerData[];
  subs_followersData!: Subscription;
  domain: string = domain;
  subs_userId!: Subscription;
  ownerData!: USerData;
  subs_ownerData!: Subscription;
  userId!: string;
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
      if (p['id']) {
        this.userId = p['id'];
        this.subs_followersData = this._socialService
          .getAllFollowers(p['id'])
          .subscribe((users) => {
            this.followersData = users.data;
          });
      }
    });
  }

  subs_follow!: Subscription;
  onFollow(user: USerData,index:number) {
    this.subs_follow = this._socialService.follow(user._id).subscribe(
      (data) => {
        if (data._id == this.userId) {
          this.followersData.push(data);
        }
        this.followersData[index].followers.push(this.ownerData._id);
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

  subs_unfollow!: Subscription;
  onUnFollow(id: string, index: number) {
    this.subs_unfollow = this._socialService.unFollow(id).subscribe(
      (data) => {
        if (data) {
          if (this.ownerData._id == this.userId) {
            this.followersData.splice(index, 1);
          }
        }
        const removeIndex = this.followersData[index].followers.indexOf(
          this.ownerData._id
        );

        this.followersData[index].followers.splice(removeIndex, 1);
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
    this.subs_followersData?.unsubscribe();
    this.subs_follow?.unsubscribe();
    this.subs_unfollow?.unsubscribe();
    this.subs_ownerData?.unsubscribe();
  }
}
