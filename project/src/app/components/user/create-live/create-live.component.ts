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

  constructor(
    private _userService: UserService,
    private _titleService: Title,
    private _socketService: SocketService,
    private _router: Router
  ) {
    setTimeout(() => {
      this.connected = this._socketService.connected();
    }, 1000);
    setTimeout(() => {
      if (this.connected) this._socketService.disconnect();
      this.connected = this._socketService.connected();
    }, 1500);
  }

  ngOnInit(): void {
    this.connected = false;
    this._titleService.setTitle('Create live');
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

  // creation of live coding
  ownerData!: USerData;
  subs_ownerData!: Subscription;
  createLive() {
    this.createLoad = true;
    this.subs_ownerData = this._userService.getUserData().subscribe(
      (data) => {
        this.ownerData = data;
        if (data && this.connected == false) {
          this._socketService.connect();
          this._socketService.emit('connectionData',data._id)
          this.connected = true;
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
    console.log(form.value.joinUrl);
    this.joinLoad = true;
    this.subs_ownerData = this._userService.getUserData().subscribe(
      (data) => {
        this.ownerData = data;
        if (data && this.connected == false) {
          this.connected = true;
          socketConnected.next('member');
          this._router.navigate([form.value.joinUrl]);
          this.joinLoad = false;
        }
      },
      (err) => {
        this.joinLoad = false;
        this.warnings = 'somthing went wrong! please try again.';
      }
    );
  }

  ngOnDestroy(): void {
    if (this.isToggledUsers) this.isToggledUsers = false;
    if (this.createLoad) this.createLoad = false;
    if (this.joinLoad) this.joinLoad = false;
    if (this.warnings) this.clearWarnings();
    this.subs_ownerData?.unsubscribe();
  }
}
