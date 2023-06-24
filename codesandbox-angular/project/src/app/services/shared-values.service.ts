import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as prodEnv from 'src/environments/environment';
import * as devEnv from 'src/environments/environment.development';

export const logModToggle = new BehaviorSubject<boolean>(true);
export const popupLog = new BehaviorSubject<boolean>(false);
export const coding = new BehaviorSubject<boolean>(false);

export let domain = isDevMode()? devEnv.environment.apiUrl:prodEnv.environment.apiUrl

@Injectable({
  providedIn: 'root',
})
export class SharedValuesService {
  constructor() {}
}
