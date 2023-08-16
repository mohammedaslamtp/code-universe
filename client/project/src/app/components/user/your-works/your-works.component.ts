import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import { YourWorks } from '../home/home.component';
import { Location } from '@angular/common';
import { currentUrl } from 'src/app/services/shared-values.service';
import { Router } from '@angular/router';
import { SocialService } from 'src/app/services/soical.service';

@Component({
  selector: 'app-your-works',
  templateUrl: './your-works.component.html',
  styleUrls: ['./your-works.component.css'],
})
export class YourWorksComponent implements OnDestroy, AfterViewInit {
  subs_UserData_collector: Subscription;
  UserData!: USerData;
  yourWorks!: Templates;
  subs_templates_array: Subscription;
  empty: boolean = false;
  constructor(
    private _userService: UserService,
    private _location: Location,
    private _router: Router,
    private _socialService: SocialService
  ) {
    YourWorks.next(true);
    this.subs_UserData_collector = this._userService
      .getUserData()
      .subscribe((data) => {
        this.UserData = data;
        this.yourWorks = this.yourWorks?.filter(
          (val) => val.user._id === data._id
        );
      });
    this.subs_templates_array = this._userService.getTemplates().subscribe(
      (templates: any) => {
        this.yourWorks = templates.all_templates;
        this.yourWorks = this.yourWorks?.filter(
          (val) => val.isPrivate == false && val.user._id == this.UserData._id
        );
        if (this.yourWorks.length == 0) {
          this.empty = true;
        }
        console.log(this.yourWorks);
      },
      (err) => {
        console.log('template data error: ', err);
      }
    );
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.yourWorks) {
        for (const el of this.yourWorks) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
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
  modalToggle(id: string) {
    const url = this._location.path();
    currentUrl.next(url);
    this._router.navigate([`/overallView/${id}`]);
  }

  // give like and return like
  subs_giveLike!: Subscription;
  Dolike(id: string) {
    const audio = new Audio('assets/sounds/click-like.mp3');
    let doc: any = this.yourWorks.filter((t) => t._id === id);
    doc = doc[0];
    doc = doc.like.filter((el: any) => el._id == this.UserData._id);
    if (doc.length == 0) {
      this.subs_giveLike = this._socialService.giveLike(id).subscribe((val) => {
        if (val) {
          this.modifyObjectById(this.yourWorks, id, val.data.like);
          audio.play();
        }
      });
    } else {
      this.subs_giveLike = this._socialService
        .returnLike(id)
        .subscribe((val) => {
          if (val) {
            this.modifyObjectById(this.yourWorks, id, val.data.like);
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

  ngOnDestroy(): void {
    YourWorks.next(false);
    this.subs_UserData_collector?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
  }
}
