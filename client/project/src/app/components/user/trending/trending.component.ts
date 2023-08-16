import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Templates } from 'src/app/types/template_types';
import { Trending } from '../home/home.component';
import { SocialService } from 'src/app/services/soical.service';
import { USerData } from 'src/app/types/UserData';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { currentUrl } from 'src/app/services/shared-values.service';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
})
export class TrendingComponent implements OnDestroy, OnInit {
  trendingTemplates!: Templates;
  subs_templates_array!: Subscription;
  subs_userData!: Subscription;
  empty: boolean = false;
  userData!: USerData;

  constructor(
    private _userService: UserService,
    private _socialService: SocialService,
    private _location: Location,
    private _router: Router
  ) {}

  ngOnInit(): void {
    setTimeout(() => Trending.next(true), 0);

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
          this.trendingTemplates = templates.all_templates;
          this.trendingTemplates = this.trendingTemplates?.filter(
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
      if (this.trendingTemplates) {
        for (const el of this.trendingTemplates) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 500);
  }

  // give like and return like
  subs_giveLike!: Subscription;
  Dolike(id: string) {
    const audio = new Audio('assets/sounds/click-like.mp3');
    let doc: any = this.trendingTemplates.filter((t) => t._id === id);
    doc = doc[0];
    doc = doc.like.filter((el: any) => el._id == this.userData._id);
    if (doc.length == 0) {
      this.subs_giveLike = this._socialService.giveLike(id).subscribe((val) => {
        if (val) {
          this.modifyObjectById(this.trendingTemplates, id, val.data.like);
          audio.play();
        }
      });
    } else {
      this.subs_giveLike = this._socialService
        .returnLike(id)
        .subscribe((val) => {
          if (val) {
            this.modifyObjectById(this.trendingTemplates, id, val.data.like);
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

  // follow specified user
  subs_followUser!: Subscription;
  follow(id: string) {
    this.subs_followUser = this._socialService.follow(id).subscribe((data) => {
      console.log(data);
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
    Trending.next(false);
    this.subs_templates_array?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
    this.subs_giveLike?.unsubscribe();
    this.subs_userData?.unsubscribe();
  }
}
