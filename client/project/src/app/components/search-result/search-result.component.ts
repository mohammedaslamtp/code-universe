import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { currentUrl } from 'src/app/services/shared-values.service';
import { SocialService } from 'src/app/services/soical.service';
import { UserService } from 'src/app/services/user.service';
import { SearchQuery } from 'src/app/stores/actions/search';
import {
  search_loadingSelector,
  search_resultSelector,
} from 'src/app/stores/selector';
import { USerData } from 'src/app/types/UserData';
import { appStateInterface } from 'src/app/types/appState';
import { Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';

export const searchQuery = new BehaviorSubject<string>('');
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnInit, OnDestroy {
  searchQ!: string;
  subs_query!: Subscription;
  searchLoading$?: Observable<boolean> | boolean = false;
  searchResult$!: Templates;
  userData!: USerData;

  searchError$?: Observable<string> | string;
  empty: boolean = false;

  subs_searchLoading!: Subscription;
  subs_searchResult!: Subscription;
  subs_userData!: Subscription;
  constructor(
    private _routerActive: ActivatedRoute,
    private _store: Store<appStateInterface>,
    private _userService: UserService,
    private _socialService: SocialService,
    private _router: Router,
    private _location: Location
  ) {}

  ngOnInit(): void {
    this.subs_userData = this._userService.getUserData().subscribe(
      (data) => {
        this.userData = data;
      },
      (e) => {
        this._router.navigate(['**']);
      }
    );

    // search request
    this.subs_query = this._routerActive.params.subscribe((param) => {
      this.searchQ = param['q'];
      searchQuery.next(param['q']);
      this._store.dispatch(SearchQuery({ q: this.searchQ }));
    });

    // search loading
    this.subs_searchLoading = this._store
      .pipe(select(search_loadingSelector))
      .subscribe((result) => {
        if (result == true) {
          this.searchLoading$ = result;
        } else {
          this.searchLoading$ = false;
        }
      });

    // search result fetching from store
    this.subs_searchResult = this._store
      .pipe(select(search_resultSelector))
      .subscribe((result: any) => {
        console.log(result);

        this.searchResult$ = result;
        setTimeout(() => {
          if (this.searchResult$) {
            for (const el of this.searchResult$) {
              this.trendingTemplateThumbnail(el.template_id);
            }
          }
        }, 100);
        if (result?.length == 0) {
          this.empty = true;
        } else {
          this.empty = false;
        }
      });
  }

  // view templates
  trendingTemplateThumbnail(id: string) {
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

  // give like and return like
  subs_giveLike!: Subscription;
  Dolike(id: string) {
    const audio = new Audio('assets/sounds/click-like.mp3');
    let doc: any = this.searchResult$.filter((t) => t._id === id);
    doc = doc[0];
    doc = doc.like.filter((el: any) => el == this.userData._id);
    if (doc.length == 0) {
      this.subs_giveLike = this._socialService.giveLike(id).subscribe((val) => {
        if (val) {
          this._store.dispatch(SearchQuery({ q: this.searchQ }));
          audio.play();
        }
      });
    } else {
      this.subs_giveLike = this._socialService
        .returnLike(id)
        .subscribe((val) => {
          if (val) {
            this._store.dispatch(SearchQuery({ q: this.searchQ }));
            audio.play();
          }
        });
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

  ngOnDestroy() {
    this.subs_query.unsubscribe();
    this.subs_searchLoading.unsubscribe();
    this.subs_searchResult?.unsubscribe();
    this.subs_userData?.unsubscribe();
    searchQuery.next('');
  }
}
