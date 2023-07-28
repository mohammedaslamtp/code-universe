import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { socketConnected } from 'src/app/services/shared-values.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Title } from '@angular/platform-browser';

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
  error: string | null = null;

  constructor(
    private _userService: UserService,
    private _titleService: Title,
    private _socketService: SocketService,
    private _router: Router
  ) {}

  ngOnInit(): void {
    this._titleService.setTitle('Create live');

    this._socketService.connect();
    // invalid room id
    this._socketService.on('room-not-found', (err) => {
      console.log('error: ', err);
      this.error = err;
      this.joinLoad = false;
    });
  }

  // toggle dropdown
  toggleDropdownUsers() {
    if (this.isToggledUsers == false) {
      this.isToggledUsers = true;
    } else {
      this.isToggledUsers = false;
    }
  }

  // close dropdown
  closeDropDown() {
    if (this.isToggledUsers == true) {
      this.isToggledUsers = false;
    }
  }

  // creation of live
  ownerData!: USerData;
  subs_ownerData!: Subscription;
  createLive() {
    this.createLoad = true;
    this.subs_ownerData = this._userService.getUserData().subscribe(
      (data) => {
        this.ownerData = data;
        if (data) {
          this._socketService.emit('connectionData', data._id);
          this._socketService.on('roomId', (roomId) => {
            socketConnected.next('creator');
            this._router.navigate([`/liveCoding/${roomId}`]);
            this.createLoad = false;
          });
        }
      },
      (err) => {
        this.createLoad = false;
        this.warnings = 'somthing went wrong! please try again.';
      }
    );
  }

  clearWarnings = () => (this.warnings = null);

  // join with url
  onSubmit(form: NgForm) {
    this.joinLoad = true;
    let roomId = String(form.value.joinUrl);
    roomId = roomId.replace('/liveCoding/', '');
    setTimeout(() => {
      this._socketService.emit('isRoomExist', roomId);
    }, 0);
    this._socketService.on('validRoom', (valid) => {
      if (valid == true) {
        this.subs_ownerData = this._userService.getUserData().subscribe(
          (data) => {
            this.ownerData = data;
            if (data) {
              socketConnected.next('member');
              if (form.value.joinUrl) {
                this._router.navigate([form.value.joinUrl]);
              }
              this.joinLoad = false;
            }
          },
          (err) => {
            this.joinLoad = false;
            this.warnings = 'somthing went wrong! please try again.';
          }
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.isToggledUsers) this.isToggledUsers = false;
    if (this.createLoad) this.createLoad = false;
    if (this.joinLoad) this.joinLoad = false;
    if (this.warnings) this.clearWarnings();
    this.error = null;
    this.subs_ownerData?.unsubscribe();
  }
}
