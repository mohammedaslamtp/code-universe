import { BehaviorSubject } from 'rxjs';
import * as prodEnv from 'src/environments/environment';

export const logModToggle = new BehaviorSubject<boolean>(true);
export const popupLog = new BehaviorSubject<boolean>(false);
export const coding = new BehaviorSubject<boolean>(false);
export const socketConnected = new BehaviorSubject<string>('empty');
export const templateListing = new BehaviorSubject<boolean>(false);
export const currentUrl = new BehaviorSubject<string>('empty');

export const domain = prodEnv.environment.apiUrl;
export const client = prodEnv.environment.clientUrl;

export class SharedValuesService {}
