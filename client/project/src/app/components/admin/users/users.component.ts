import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { getUsers } from 'admin_store/actions/users_data';
import { blockUser } from 'admin_store/actions/blockUser';
import { unblockUser } from 'admin_store/actions/unblockUser';
import { adminAppState } from 'admin_store/admin_types/adminApp';
import { getAllUsers, blockedUserSelector, unblockedUserSelector } from 'admin_store/selectors';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users$?: any | null;
  confirmation: any;
  Toast: any;
  constructor(private store: Store<adminAppState>) {
    // swal : 1
    this.confirmation = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });

    // swal : 2
    this.Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1400,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });

    this.store.pipe(select(getAllUsers)).subscribe((users: any) => {
      this.users$ = users;
    });

  }
  ngOnInit(): void {
    this.store.dispatch(getUsers());
  }

  // block user:
  blockUser(id: string, name: string) {
    this.confirmation
      .fire({
        title: 'Are you sure?',
        text: `Do you want to block ${name}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.store.dispatch(blockUser({ id: id }));
          this.store.dispatch(getUsers());
          this.Toast.fire({
            icon: 'success',
            title: `${name} is blocked👍`,
          });
        }
      });
  }

  // unblock user:
  unblockUser(id: string, name: string) {
    this.confirmation
      .fire({
        title: 'Are you sure?',
        text: `Do you want to Unblock ${name}!`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirm',
        cancelButtonText: 'Cancel',
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          this.store.dispatch(unblockUser({ id: id }));
          this.store.dispatch(getUsers());
          this.Toast.fire({
            icon: 'success',
            title: `${name} is unblocked👍`,
          });
        }
      });
  }
}
