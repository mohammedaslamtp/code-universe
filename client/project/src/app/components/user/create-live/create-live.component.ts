import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { socketConnected } from 'src/app/services/shared-values.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Title } from '@angular/platform-browser';
import { domain } from 'src/app/services/shared-values.service';

@Component({
  selector: 'app-create-live',
  templateUrl: './create-live.component.html',
  styleUrls: ['./create-live.component.css'],
})
export class CreateLiveComponent implements OnInit, OnDestroy {
  isToggledUsers: boolean = false;
  warnings: string | null = null;
  createLoad: boolean = false;
  joinLoad: boolean = false;
  connected: boolean = false;
  domain = domain;
  error: string | null = null;
  ownerData!: USerData;
  subs_ownerData!: Subscription;

  constructor(
    private _userService: UserService,
    private _titleService: Title,
    private _socketService: SocketService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._titleService.setTitle('Create live');

    this.subs_ownerData = this._userService.getUserData().subscribe(
      (data) => {
        this.ownerData = data;
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );

    this._socketService.connect();
    // invalid room id
    this._socketService.on('room-not-found', (err) => {
      console.log('error: ', err);
      this.error = err;
      this.joinLoad = false;
    });
  }

  

  // close dropdown
  closeDropDown() {
    if (this.isToggledUsers == true) {
      this.isToggledUsers = false;
    }
  }

  // creation of live
  createLive() {
    this.createLoad = true;
    this._socketService.emit('connectionData', this.ownerData._id);
    this._socketService.on('roomId', (roomId) => {
      socketConnected.next('creator');
      this._router.navigate([`/liveCoding/${roomId}`]);
      this.createLoad = false;
    });
  }

  clearWarnings = () => (this.warnings = null);

  // join with url
  subs_joinUrl!: Subscription;
  onSubmit(form: NgForm) {
    this.joinLoad = true;
    let roomId = String(form.value.joinUrl);
    roomId = roomId.replace('/liveCoding/', '');
    this._userService.isValidLive(roomId).subscribe((valid) => {
      console.log('isvalid ', valid);

      if (valid == true) {
        if (this.ownerData) {
          socketConnected.next('member');
          if (form.value.joinUrl) {
            this._router.navigate([form.value.joinUrl]);
          }
          this.joinLoad = false;
        }
      } else {
        this.error = "Live dosen't exist!";
        this.joinLoad = false;
      }
    });
  }

  clearError = () => (this.error = null);

  ngOnDestroy(): void {
    if (this.isToggledUsers) this.isToggledUsers = false;
    if (this.createLoad) this.createLoad = false;
    if (this.joinLoad) this.joinLoad = false;
    if (this.warnings) this.clearWarnings();
    this.clearError();
    this.subs_ownerData?.unsubscribe();
    this.subs_joinUrl?.unsubscribe();
  }
}
