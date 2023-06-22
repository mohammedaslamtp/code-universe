import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import { Id, Name, allCodesPage } from '../user-profile/user-profile.component';
import Swal from 'sweetalert2';
import { MainService } from 'src/app/services/main.service';
import { CoreModule } from 'src/app/modules/core/core.module';

@Component({
  selector: 'app-all-codes',
  templateUrl: './all-codes.component.html',
  styleUrls: ['./all-codes.component.css'],
})
export class AllCodesComponent implements OnDestroy {
  templates!: Templates;
  subs_templates!: Subscription;
  ownTemplates!: Templates;
  userData!: USerData;
  subs_userData!: Subscription;
  subs_userId: Subscription;
  userId: string | null = '';
  userName: string | null = '';
  empty: boolean = false;
  isLoading: boolean = false;
  isAccountOwner: boolean = false;
  subs_username!: Subscription;
  subs_Id!: Subscription;
  subs_tempUserData!: Subscription;
  constructor(
    private _userService: UserService,
    private _mainService: MainService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    allCodesPage.next(true);
    // getting user data
    this.subs_userId = this._activatedRoute.paramMap.subscribe((param) => {
      this.isLoading = true;
      if (param.get('id')) {
        const userid = param.get('id');
        Id.next(userid);
        this.subs_Id = Id.subscribe((val) => (this.userId = val));
        if (typeof this.userId == 'string') {
          this.updateData(this.userId, 'id');
        }
      } else if (param.get('username')) {
        const username = param.get('username');
        this.userName = username;
        Name.next(username);
        if (this.userName) {
          this.updateData(this.userName, 'username');
        }
      } else {
        this._router.navigate(['**']);
      }
    });

    setTimeout(() => {
      if (this.templates) {
        for (const el of this.templates) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
  }

  updateData(str: string, through: string) {
    if (through == 'id') {
      this.subs_userData = this._mainService.getUserData(str).subscribe(
        (data) => {
          this.userData = data;
          this.userName = data.full_name;
          this.subs_tempUserData = this._userService
            .getUserData()
            .subscribe((data) => {
              if (data._id == this.userData?._id) {
                this.isAccountOwner = true;
              } else {
                this.isAccountOwner = false;
              }
            });
        },
        (e) => {
          this._router.navigate(['**']);
        }
      );
    } else if (through == 'username') {
      this.subs_userData = this._userService.getUserData(str).subscribe(
        (data) => {
          this.userName = data.full_name;
          this.userData = data;
          this.subs_tempUserData = this._userService
            .getUserData()
            .subscribe((data) => {
              if (data.full_name == this.userData?.full_name) {
                this.isAccountOwner = true;
              } else {
                this.isAccountOwner = false;
              }
            });
        },
        (e) => {
          this._router.navigate(['**']);
        }
      );
      if (this.userName === this.userData?.full_name) {
        this.isAccountOwner = true;
      } else {
        this.isAccountOwner = false;
      }
    }

    // getting all templates
    this.subs_templates = this._userService
      .getTemplates()
      .subscribe((data: any) => {
        this.templates = data?.all_templates;
        // filtering own templates
        if (this.userName) {
          this.ownTemplates = this.templates.filter(
            (el) => el.user.full_name == this.userName && el.isPrivate == false
          );
        } else if (this.userId) {
          this.ownTemplates = this.templates.filter(
            (el) => el.user._id == this.userId && el.isPrivate == false
          );
        }
        this.isLoading = false;
        if (this.ownTemplates.length == 0) {
          this.empty = true;
          this.isLoading = false;
        } else {
          this.empty = false;
          this.isLoading = false;
        }
      });
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

  // to make private the code
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
          this.ownTemplates = this.ownTemplates.filter((val) => val._id != id);

          if (this.ownTemplates.length == 0) {
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
    this.dropdownOpen[id] = false;
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
              this.ownTemplates = this.ownTemplates.filter(
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
    allCodesPage.next(false);
    this.subs_userData?.unsubscribe();
    this.subs_templates?.unsubscribe();
    this.subs_userId?.unsubscribe();
    if (this.subs_deleteResponse) this.subs_deleteResponse.unsubscribe();
    this.subs_username?.unsubscribe();
    this.subs_Id?.unsubscribe();
  }
}
