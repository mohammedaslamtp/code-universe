import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export const logModToggle = new BehaviorSubject<boolean>(true);
export const popupLog = new BehaviorSubject<boolean>(false);
export const coding = new BehaviorSubject<boolean>(false);

@Injectable({
  providedIn: 'root',
})
export class SharedValuesService {
  constructor() {}
}
