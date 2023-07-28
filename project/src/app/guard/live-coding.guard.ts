import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';

export const skipWork = new BehaviorSubject<boolean>(false);

@Injectable()
export class LiveCodingGuard implements CanDeactivate<unknown> {
  skiping!: boolean;
  constructor() {
    skipWork.subscribe((val) => {
      if (val == true) this.skiping = true;
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
    if (this.skiping == true) {
      return true;
    }
    return Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to leave from this live?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Leave!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      return result.isConfirmed;
    });
  }
}
