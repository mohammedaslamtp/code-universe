import { Injectable, OnDestroy } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { templateListing } from '../services/shared-values.service';

@Injectable()
export class CodingGuard implements CanDeactivate<unknown>, OnDestroy {
  isListing: boolean = false;
  subs_templateListing: Subscription;
  constructor() {
    this.subs_templateListing = templateListing.subscribe((val) => {
      this.isListing = val;
    });
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (this.isListing == true) {
      return true;
    } else {
      return Swal.fire({
        title: 'Unsaved Changes!',
        text: 'Are you sure?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'discard',
      }).then((result) => {
        return result.isConfirmed;
      });
    }
  }

  ngOnDestroy(): void {}
}
