import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Store, select } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SearchQuery } from 'src/app/stores/actions/search';
import {
  search_errorSelector,
  search_loadingSelector,
  search_resultSelector,
} from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';
import { Codes } from 'src/app/types/template_types';

@Component({
  selector: 'app-searching',
  templateUrl: './searching.component.html',
  styleUrls: ['./searching.component.css'],
})
export class SearchingComponent implements OnInit, OnDestroy {
  loading: boolean = true;
  empty: boolean = false;
  notFound: boolean = false;

  searchResult$!: Codes;
  searchError$?: Observable<string> | string | null;
  subs_query!: Subscription;

  subs_searchLoading!: Subscription;
  subs_error!: Subscription;
  subs_searchResult!: Subscription;

  constructor(
    private _store: Store<appStateInterface>,
    private _userService: UserService
  ) {}
  ngOnInit(): void {
    this.loading = false;
    this.empty = true;
    this.notFound = false;

    // search loading
    this.subs_searchLoading = this._store
      .pipe(select(search_loadingSelector))
      .subscribe((result) => {
        if (result) {
          this.loading = true;
          this.empty = false;
        } else {
          this.loading = false;
        }
      });

    // search error
    this.subs_error = this._store
      .pipe(select(search_errorSelector))
      .subscribe((result) => {
        this.loading = false;
        this.empty = true;
        this.notFound = false;
      });

    // search result fetching from store
    this.subs_searchResult = this._store
      .pipe(select(search_resultSelector))
      .subscribe((result: any) => {
        this.loading = false;
        this.searchResult$ = result;
        setTimeout(() => {
          if (this.searchResult$) {
            for (const el of this.searchResult$) {
              this.trendingTemplateThumbnail(el.template_id);
            }
          }
        }, 100);
        if (result) {
          if (result?.length > 0) {
            this.empty = false;
            this.notFound = false;
          } else {
            console.log();
            this.empty = true;
            this.notFound = true;
          }
        }
      });
  }

  @ViewChild('search', { static: false }) searchField!: ElementRef;
  focusSearch = () => this.searchField.nativeElement.focus();
  query!: string;
  searchIt(form: NgForm) {
    this.loading = true;
    const query = form.controls['searchQ'].value as string;
    this.query = query;
    // search request
    this._store.dispatch(SearchQuery({ q: query }));
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

  pleaseLogin() {
    this.searchError$ = 'login error';
  }
  closeAlert() {
    this.searchError$ = null;
  }

  ngOnDestroy(): void {
    this.loading = false;
    this.subs_searchResult?.unsubscribe();
    this.subs_error?.unsubscribe();
    this.subs_searchLoading?.unsubscribe();
  }
}
