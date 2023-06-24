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
import { BehaviorSubject, Subscription } from 'rxjs';
import { USerData } from 'src/app/types/UserData';

export const userProfile = new BehaviorSubject<boolean>(false);

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit, OnDestroy, AfterViewInit {
  authenticated: boolean = false;
  searchQuery: string = '';
  searchQ: Subscription;
  subs_userData?: Subscription;
  isProfile: boolean = false;
  subs_userProfile?: Subscription;
  dropDownOpened: boolean = false;
  userData!: USerData;

  search = new FormGroup({
    q: new FormControl(null),
  });

  @ViewChild('searchQ', { static: false }) query!: ElementRef<HTMLInputElement>;
  constructor(private _userService: UserService, private _router: Router) {
    this.is_guest();
    this.subs_userProfile = userProfile.subscribe((val) => {
      this.isProfile = val;
    });

    this.searchQ = searchQuery.subscribe((q: any) => {
      this.searchQuery = q;
    });
    if (this.authenticated) {
      this.subs_userData = this._userService
        .getUserData()
        .subscribe((data: USerData) => {
          this.userData = data;
        });
    }
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
        this._router.navigate(['/search', searchData]);
      }
    }
  }

  profile() {
    this._router.navigate(['/userProfile', this.userData.full_name]);
  }

  dropDown() {
    if (this.dropDownOpened == true) {
      this.dropDownOpened = false;
    } else {
      this.dropDownOpened = true;
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
    this.subs_userProfile?.unsubscribe();
    this.dropDownOpened = false;
    this.subs_userData?.unsubscribe();
  }
}
