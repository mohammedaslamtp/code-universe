import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';
import { publicPage } from '../user-profile/user-profile.component';
import { currentUrl } from 'src/app/services/shared-values.service';
import { Location } from '@angular/common';
import { SocialService } from 'src/app/services/soical.service';

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
  subs_deleteResponse!: Subscription;
  empty: boolean = false;
  userData!: USerData;
  userId!: string;
  isLoading: boolean = false;

  constructor(
    private _routerActicated: ActivatedRoute,
    private _mainService: MainService,
    private _userService: UserService,
    private _socialService: SocialService,
    private _location:Location,
    private _router: Router
  ) {
    publicPage.next(true);
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
    setTimeout(() => {
      if (this.publicCodes) {
        for (const el of this.publicCodes) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
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
  deleteLoading: boolean = false;
  deleteCode(id: string, name: string) {
    this.deleteLoading = true;
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
            this.deleteLoading = false;
            this.publicCodes = this.publicCodes.filter((val) => val._id != id);
            if (isDeleted) {
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
            this.deleteLoading = false;
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

  // preview of code
  subs_codePreview!: Subscription;
  previewOfCode(id: string) {
    const iframes: NodeListOf<HTMLIFrameElement> =
      document.querySelectorAll('.www');
    const iframeArray: HTMLIFrameElement[] = Array.from(iframes);
    this.subs_codePreview = this._userService.reloadIframe(id).subscribe(
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


   // give like and return like
   subs_giveLike!: Subscription;
   Dolike(id: string) {
     const audio = new Audio('assets/sounds/click-like.mp3');
     let doc: any = this.publicCodes.filter((t) => t._id === id);
     doc = doc[0];
     doc = doc.like.filter((el: any) => el._id == this.userData._id);
     if (doc.length == 0) {
       this.subs_giveLike = this._socialService.giveLike(id).subscribe((val) => {
         if (val) {
           this.modifyObjectById(this.publicCodes, id, val.data.like);
           audio.play();
         }
       });
     } else {
       this.subs_giveLike = this._socialService
         .returnLike(id)
         .subscribe((val) => {
           if (val) {
             this.modifyObjectById(this.publicCodes, id, val.data.like);
             audio.play();
           }
         });
     }
   }
 
   // Function to find and modify object by ID
   modifyObjectById(array: Templates, id: string, newValue: [string]) {
     const index = array.findIndex((obj) => obj._id === id);
     if (index !== -1) {
       // Modify the desired field
       array[index].like = newValue;
     }
   }
 
   // go to the overall view section
   overView(id: string) {
     const url = this._location.path();
     currentUrl.next(url);
     this._router.navigate([`/overallView/${id}`]);
   }

   subs_pin!: Subscription;
  addToPin(id: string): void {
    this.subs_pin = this._socialService.addToPin(id).subscribe(
      (result) => {
        this.swalAlert(200, 'Item added successfully');
      },
      (e) => {
        this.swalAlert(404, 'Something went wrong!');
      }
    );
  }

  // sweet_alert
  swalAlert(status: number, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2500,
      showCloseButton: true,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: status > 400 ? 'error' : 'success',
      title: `${message}`,
    });
  }

  ngOnDestroy(): void {
    publicPage.next(false);
    this.subs_OwnerData.unsubscribe();
    this.subs_userData?.unsubscribe();
    this.subs_giveLike?.unsubscribe();
    this.subs_publicCodes?.unsubscribe();
    this.subs_params?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
    this.subs_deleteResponse?.unsubscribe();
  }
}
