import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Template, Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';
import { publicPage } from '../user-profile/user-profile.component';
import { CoreModule } from 'src/app/modules/core/core.module';

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

  // quick view
  quiqkView(el: Template) {
    Swal.fire({
      html: `
    <p style="padding:0.4em;">Lorem ipsum <b>sit</b> amet consectetur, adipisicing elit. Sint temporibus, rerum unde excepturi doloremque totam accusamus esse impedit cupiditate, incidunt eaque vel ipsum fuga deserunt eum quisquam maiores soluta quasi!
      Recusandae maiores fugit eveniet, sit eos excepturi nihil impedit perferendis, magni facilis saepe ipsa voluptas veritatis harum, accusantium sed iusto illo ex! Commodi voluptates adipisci soluta nulla numquam error facilis!
      Repellendus voluptates maxime error aliquam quod, laudantium commodi dolorum veniam dolor nulla laborum animi eligendi autem corporis quas, nemo iusto. Voluptas nostrum assumenda, perferendis repudiandae voluptate eum consequatur velit saepe?
      Sint, dolorem aspernatur laborum assumenda laboriosam reprehenderit, natus nostrum voluptatum atque, dolores dicta. Possimus quaerat architecto eligendi, incidunt veniam iusto, ad sit a, ullam voluptatum quam quia! Obcaecati, velit aliquam.
      Neque sed ratione doloribus voluptatibus rerum voluptatem! Animi excepturi cum quae odit voluptatem libero omnis neque fuga quas facere. Beatae tempore ratione, optio similique quas dolorem deleniti at vel cupiditate.
      Est, animi voluptas ipsum cupiditate aspernatur iusto, ipsa ex mollitia architecto a eligendi neque dolores sunt, dolorum obcaecati reiciendis eveniet aut asperiores consequatur excepturi! Adipisci nostrum natus voluptatibus eveniet dolorum.</p>
    `,
      showConfirmButton: false,
      showCloseButton: true,
      width: '900px',
    });
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
  subs_codePreview!:Subscription
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

  ngOnDestroy(): void {
    publicPage.next(false)
    this.subs_OwnerData.unsubscribe();
    this.subs_userData?.unsubscribe();
    this.subs_publicCodes?.unsubscribe();
    this.subs_params?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
    this.subs_deleteResponse?.unsubscribe();
  }
}
