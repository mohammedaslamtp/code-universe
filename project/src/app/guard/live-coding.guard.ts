import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanDeactivate,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable()
export class LiveCodingGuard implements CanDeactivate<unknown> {
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
