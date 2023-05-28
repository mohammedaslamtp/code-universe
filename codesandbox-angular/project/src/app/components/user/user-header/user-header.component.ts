import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit {
  authenticated: boolean = false;
  constructor(private _userService: UserService) {
    this.is_guest();
  }

  ngOnInit(): void {
    this.is_guest();
  }

  is_guest() {
    this.authenticated = this._userService.loggedIn();
  }

  search = new FormGroup({
    q: new FormControl(null),
  });

  searching() {
    if (this.search.value.q) {
      let searchData: string = this.search.value.q;
      searchData = searchData.replace(/\s+/g, ' ');
      if (searchData != ' ') {
        if (searchData[0] == ' ') searchData = searchData.slice(1);
        console.log(searchData);
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
}
