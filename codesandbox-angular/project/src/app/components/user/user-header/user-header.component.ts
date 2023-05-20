import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css'],
})
export class UserHeaderComponent implements OnInit {
  authenticated: boolean = false;
  constructor(private userService: UserService) {
    this.is_guest();
  }

  ngOnInit(): void {
    this.is_guest();
  }

  is_guest() {
    this.authenticated = this.userService.loggedIn();
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
        this.userService.logout();
      }
    });
  }
}
