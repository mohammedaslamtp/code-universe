import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { SearchQuery } from 'src/app/stores/actions/search';
import {
  search_loadingSelector,
  search_resultSelector,
} from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';
import { Codes } from 'src/app/types/template_types';

export const searchQuery = new BehaviorSubject<string>('');
@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css'],
})
export class SearchResultComponent implements OnDestroy {
  searchQ!: string;
  subs_query: Subscription;
  searchLoading$?: Observable<boolean> | boolean = false;
  searchResult$!: Codes;
  result?: Codes;
  searchError$?: Observable<string> | string;
  empty: boolean = false;

  subs_searchLoading: Subscription;
  subs_searchResult: Subscription;
  constructor(
    private _routerActive: ActivatedRoute,
    private _store: Store<appStateInterface>,
    private _userService:UserService
  ) {
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

  ngOnDestroy() {
    this.subs_query.unsubscribe();
    this.subs_searchLoading.unsubscribe();
    this.subs_searchResult?.unsubscribe();
    searchQuery.next('');
  }
}
