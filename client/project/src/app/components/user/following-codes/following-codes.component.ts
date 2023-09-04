import { Component, OnDestroy, OnInit } from '@angular/core';
import { Templates } from 'src/app/types/template_types';
import { Following } from '../home/home.component';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { SocialService } from 'src/app/services/soical.service';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { USerData } from 'src/app/types/UserData';
import { currentUrl } from 'src/app/services/shared-values.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-following-codes',
  templateUrl: './following-codes.component.html',
  styleUrls: ['./following-codes.component.css'],
})
export class FollowingCodesComponent implements OnInit, OnDestroy {
  followingCodes!: Templates;
  userData!: USerData;
  subs_userData!: Subscription;
  subs_templates_array!: Subscription;
  empty: boolean = false;
  constructor(
    private _socialService: SocialService,
    private _userService: UserService,
    private _location: Location,
    private _router: Router
  ) {
    Following.next(true);
  }

  ngOnInit(): void {
    this.subs_userData = this._userService.getUserData().subscribe(
      (data) => {
        this.userData = data;
      },
      (e) => {
        this._router.navigate(['**']);
      }
    );

    // fetching templates
    this.subs_templates_array = this._userService.getTemplates().subscribe(
      (templates: any) => {
        if (templates.all_templates.length !== 0) {
          this.empty = false;
          this.followingCodes = templates.all_templates;
          this.followingCodes = this.followingCodes?.filter(
            (val) => val.isPrivate == false
          );
        } else {
          this.empty = true;
        }
      },
      (err) => {
        console.log('template data error: ', err);
      }
    );

    setTimeout(() => {
      if (this.followingCodes) {
        for (const el of this.followingCodes) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
  }

  // give like and return like
  subs_giveLike!: Subscription;
  Dolike(id: string) {
    const audio = new Audio('assets/sounds/click-like.mp3');
    let doc: any = this.followingCodes.filter((t) => t._id === id);
    doc = doc[0];
    doc = doc.like.filter((el: any) => el._id == this.userData._id);
    if (doc.length == 0) {
      this.subs_giveLike = this._socialService.giveLike(id).subscribe((val) => {
        if (val) {
          this.modifyObjectById(this.followingCodes, id, val.data.like);
          audio.play();
        }
      });
    } else {
      this.subs_giveLike = this._socialService
        .returnLike(id)
        .subscribe((val) => {
          if (val) {
            this.modifyObjectById(this.followingCodes, id, val.data.like);
            audio.play();
          }
        });
    }
  }

  // Function to find and modify object by ID
  modifyObjectById(array: Templates, id: string, newValue: [string]) {
    console.log(newValue);

    const index = array.findIndex((obj) => obj._id === id);
    if (index !== -1) {
      // Modify the desired field
      array[index].like = newValue;
    }
  }

  // toggle dropdown for card
  cardDropDown: { [key: string]: boolean } = {};
  toggleDropdown(id: string) {
    this.cardDropDown[id] = !this.cardDropDown[id];
    for (const i in this.cardDropDown) {
      if (i != id) {
        this.cardDropDown[i] = false;
      }
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

  // view templates
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

  ngOnDestroy(): void {
    Following.next(false);
    this.subs_codePreview?.unsubscribe();
    this.subs_pin?.unsubscribe();
    this.subs_templates_array?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
    this.subs_giveLike?.unsubscribe();
    this.subs_userData?.unsubscribe();
  }
}
