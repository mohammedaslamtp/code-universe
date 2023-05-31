import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { searchQuery } from '../../search-result/search-result.component';
import { Subscription } from 'rxjs';
import { SearchQuery } from 'src/app/stores/actions/search';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  authenticated: boolean = false;
  searchQuery: string = '';
  searchQ: Subscription;

  search = new FormGroup({
    q: new FormControl(null),
  });

  @ViewChild('searchQ', { static: false }) query!: ElementRef<HTMLInputElement>;
  constructor(
    private _userService: UserService,
    private _router: Router,
    private _store: Store
  ) {
    this.is_guest();
    this.searchQ = searchQuery.subscribe((q: any) => {
      this.searchQuery = q;
    });
  }

  ngAfterViewInit() {
    if (this.query && this.query.nativeElement) {
      this.query.nativeElement.value = this.searchQuery;
    }
  }

  ngOnInit(): void {
    this.is_guest();
  }

  is_guest() {
    this.authenticated = this._userService.loggedIn();
  }

  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (event.key == '/') {
      this.query.nativeElement.focus();
    }
  }

  searching() {
    if (this.search.value.q) {
      let searchData: string = this.search.value.q;
      searchData = searchData.trim();
      if (searchData != '') {
        searchQuery.next(searchData);
        // this._store.dispatch(SearchQuery({ q: searchData }));
        this._router.navigate(['/search', searchData]);
      }
    }
  }

  logout() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'logout',
    }).then((result) => {
      if (result.isConfirmed) {
        this.authenticated = false;
        this._userService.logout();
      }
    });
  }

  ngOnDestroy() {
    this.searchQ.unsubscribe();
  }
}
