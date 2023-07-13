import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';
import { privatePage } from '../user-profile/user-profile.component';
import { CoreModule } from 'src/app/modules/core/core.module';

@Component({
  templateUrl: './private-codes.component.html',
  styleUrls: ['./private-codes.component.css'],
})
export class PrivateCodesComponent implements OnDestroy {
  subs_userData!: Subscription;
  subs_params: Subscription;
  subs_privateCodes!: Subscription;
  privateCodes!: Templates;
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
    private _router: Router
  ) {
    privatePage.next(true);
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
      this.subs_privateCodes = this._userService
        .getPrivateCodes(this.userId)
        .subscribe(
          (data) => {
            this.isLoading = false;
            this.privateCodes = data;
            if (data.length == 0) {
              this.empty = true;
            } else {
              this.empty = false;
            }
          },
          (err) => {
            console.log(err);
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'error',
              title: 'Network issue! Please try again..',
            });
          }
        );
    });
    setTimeout(() => {
      if (this.privateCodes) {
        for (const el of this.privateCodes) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
  }

  // preview of code
  previewOfCode(id: string) {
    const iframes: NodeListOf<HTMLIFrameElement> =
      document.querySelectorAll('.www');
    const iframeArray: HTMLIFrameElement[] = Array.from(iframes);
    this._userService.reloadIframe(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        for (const el of iframeArray) {
          if (el.id == id) {
            el.src = url;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  // to make public the code
  subs_codePriveiew!: Subscription;
  publicLoading: boolean = false;
  subs_publicCode!: Subscription;
  makePublic(id: string): void {
    this.publicLoading = true;
    this.subs_codePriveiew = this.subs_publicCode = this._userService
      .publicCode(id)
      .subscribe(
        (val: any) => {
          if (val.isPublic == true) {
            this.publicLoading = false;
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
              title: 'Updated to Public',
            });
            this.privateCodes = this.privateCodes.filter(
              (val) => val._id != id
            );
            if (this.privateCodes.length == 0) {
              this.empty = true;
            }
          } else {
            this.publicLoading = false;
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
          this.publicLoading = false;
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
    this.dropdownOpen[id] = false;
  }

  // toggle dropdown in card
  dropdownOpen: { [key: string]: boolean } = {};
  toggleDropdown(elementId: string) {
    this.dropdownOpen[elementId] = !this.dropdownOpen[elementId];
    for (const i in this.dropdownOpen) {
      if (i != elementId) {
        this.dropdownOpen[i] = false;
      }
    }
  }

  // to delete the code
  deletLoading: boolean = false;
  subs_deleteResponse!: Subscription;
  deleteCode(id: string, name: string) {
    this.deletLoading = true;
    this.dropdownOpen[id] = false;

    Swal.fire({
      title: 'Are you sure?',
      html: `<p>Do you want to delete <b>${name}</b>?</p>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#1f2937',
      confirmButtonText: 'Delete',
    }).then((result) => {
      if (result.isConfirmed) {
        this.subs_deleteResponse = this._userService.deleteCode(id).subscribe(
          (isDeleted) => {
            if (isDeleted) {
              this.deletLoading = false;
              this.privateCodes = this.privateCodes.filter(
                (val) => val._id != id
              );
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
                title: 'Deleted succesfully',
              });
            }
          },
          (err) => {
            console.log('error! ', err);
            this.deletLoading = false;
            const Toast = Swal.mixin({
              toast: true,
              position: 'top-end',
              showConfirmButton: false,
              timer: 3000,
              timerProgressBar: true,
              didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
              },
            });
            Toast.fire({
              icon: 'error',
              title: 'Please check your Network!',
            });
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    privatePage.next(false);
    this.subs_OwnerData.unsubscribe();
    this.subs_userData?.unsubscribe();
    this.subs_privateCodes?.unsubscribe();
    this.subs_codePriveiew?.unsubscribe();
    this.subs_params?.unsubscribe();
    this.subs_publicCode?.unsubscribe();
    this.subs_deleteResponse?.unsubscribe();
  }
}
