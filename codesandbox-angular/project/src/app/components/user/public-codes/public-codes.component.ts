import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';
// import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-public-codes',
  templateUrl: './public-codes.component.html',
  styleUrls: ['./public-codes.component.css'],
})
export class PublicCodesComponent implements OnDestroy {
  subs_userData!: Subscription;
  subs_params: Subscription;
  subs_publicCodes!: Subscription;
  publicCodes!: Templates;
  isAccountOwner: boolean = true;
  subs_OwnerData!: Subscription;
  empty: boolean = false;
  userData!: USerData;
  userId!: string;
  isLoading: boolean = false;

  constructor(
    private _routerActicated: ActivatedRoute,
    private _mainService: MainService,
    private _userService: UserService,
    private _router: Router // private _cdr: ChangeDetectorRef
  ) {
    // this._cdr.detectChanges();
    // this._cdr.markForCheck();
    this.subs_params = this._routerActicated.params.subscribe((param) => {
      this.subs_OwnerData = this._userService
        .getUserData()
        .subscribe((data) => {
          if (data) {
            if (data._id === param['id']) {
              this.isAccountOwner = true;
            } else {
              this.isAccountOwner = false;
              this._router.navigate(['**']);
            }
          } else {
            this._router.navigate(['**']);
          }
        });
      this.isLoading = true;
      this.userId = param['id'];
      this.subs_userData = this._mainService.getUserData(this.userId).subscribe(
        (data) => {
          this.userData = data;
        },
        (err) => {
          this._router.navigate(['**']);
        }
      );
      this.subs_publicCodes = this._userService
        .getPublicCodes(this.userId)
        .subscribe(
          (data) => {
            this.isLoading = false;
            this.publicCodes = data;
            if (data.length == 0) {
              this.empty = true;
            } else {
              this.empty = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  privateLoading: boolean = false;
  makePrivate(id: string): void {
    this.privateLoading = true;
    this._userService.privateCode(id).subscribe(
      (val: any) => {
        if (val.isPrivate == true) {
          this.privateLoading = false;
          const Toast = Swal.mixin({
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
            },
          });
          Toast.fire({
            icon: 'success',
            title: 'Updated to Private',
          });
          this.publicCodes = this.publicCodes.filter((val) => val._id != id);

          if (this.publicCodes.length == 0) {
            this.empty = true;
          }
        } else {
          this.privateLoading = true;
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
      },
      (err) => {
        this.privateLoading = true;
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
    this.subs_OwnerData.unsubscribe();
    this.subs_userData.unsubscribe();
    this.subs_publicCodes.unsubscribe();
    this.subs_params.unsubscribe();
  }
}
