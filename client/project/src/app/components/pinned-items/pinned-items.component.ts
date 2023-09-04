import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { currentUrl } from 'src/app/services/shared-values.service';
import { SocialService } from 'src/app/services/soical.service';
import { Templates } from 'src/app/types/template_types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-pinned-items',
  templateUrl: './pinned-items.component.html',
  styleUrls: ['./pinned-items.component.css'],
})
export class PinnedItemsComponent implements OnInit, OnDestroy {
  pinnedItems!: Templates;
  subs_pinnedItems!: Subscription;
  constructor(
    private _socialService: SocialService,
    private _location: Location,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this.subs_pinnedItems = this._socialService.allPinnedItems().subscribe(
      (items) => {
        console.log(items);
        this.pinnedItems = items.data;
      },
      (e) => {
        this.swalAlert(404, 'Something went wrong!');
      }
    );
  }

  // remove from pinned items
  subs_remove!: Subscription;
  remove(id: string): void {
    this.subs_remove = this._socialService.removeFromPin(id).subscribe(
      (res) => {
        const index = this.pinnedItems.findIndex((i) => i._id == id);
        this.pinnedItems.splice(index, 1);
      },
      (e) => {
        this.swalAlert(404, 'Something went wrong!');
      }
    );
  }

  // go to the overall view section
  overView(id: string) {
    const url = this._location.path();
    currentUrl.next(url);
    this._router.navigate([`/overallView/${id}`]);
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

  ngOnDestroy(): void {
    this.subs_pinnedItems?.unsubscribe();
    this.subs_remove?.unsubscribe();
  }
}
