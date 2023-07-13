import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  client,
  socketConnected,
} from 'src/app/services/shared-values.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Title } from '@angular/platform-browser';
import { AngularFaviconService } from 'angular-favicon';

@Component({
  selector: 'app-live-coding',
  templateUrl: './live-coding.component.html',
  styleUrls: ['./live-coding.component.css'],
})
export class LiveCodingComponent implements OnInit, OnDestroy {
  isToggledUsers: boolean = false;
  connectedUsers!: [USerData];
  owner!: USerData;
  isCreator: boolean = false;
  room!: string;

  subs_owner!: Subscription;
  subs_isConnected!: Subscription;

  // blocking reaload
  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    // Show confirmation dialog
    // event.returnValue = 'Are you sure you want to leave this page?';
    
  }

  constructor(
    private _socketService: SocketService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _titleService: Title,
    private _ngxFavIcon: AngularFaviconService
  ) {
    this.subs_isConnected = socketConnected.subscribe((val) => {
      if (val !== 'empty' && val === 'creator') {
        this.isCreator = true;
      } else if (val !== 'empty' && val === 'member') {
        this.isCreator = false;
      } else {
        this.isCreator = false;
      }
    });
    this.room = this._activatedRoute.snapshot.paramMap.get('room') + '';
  }

  ngOnInit() {
    this._titleService.setTitle('CODEBOX LIVE');
    // socket connection:
    this.subs_owner = this._userService.getUserData().subscribe((data) => {
      this.owner = data;
      if (this.room) {
        console.log(this.room);
        this.joinToLive(data._id, this.room, this.isCreator);
        this._ngxFavIcon.setFavicon(
          `${client}/assets/images/liveStroke2/favicon.ico`
        );
        this.toggleFavicon();
      }
    });
  }

  // Toggle the favicon
  iconInterval!: any;
  toggleFavicon(): void {
    const ico = document.getElementById('favicon') as HTMLLinkElement;
    const favicon1 = `${client}/assets/images/liveStroke1/favicon.ico`;
    const favicon2 = `${client}/assets/images/liveStroke2/favicon.ico`;

    this.iconInterval = setInterval(() => {
      if (ico.href == favicon1) {
        this._ngxFavIcon.setFavicon(favicon2);
      } else if (ico.href == favicon2) {
        this._ngxFavIcon.setFavicon(favicon1);
      }
    }, 1000);
  }

  // join to room
  joinToLive(userId: string, roomId: string, isCreator: boolean) {
    this._socketService.emit('joinRoom', {
      userId: userId,
      roomId: roomId,
      isCreator: isCreator,
    });
  }

  // leave from room
  leaveFromLive(userId: string, roomId: string, isCreator: boolean) {
    this._socketService.emit('leaveRoom', {
      userId: userId,
      roomId: roomId,
      isCreator: isCreator,
    });
  }

  // editor options and setup:
  htmlOptions = {
    lineNumbers: true,
    autofocus: true,
    theme: 'ayu-mirage',
    mode: 'htmlmixed',
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
    autoCloseBrackets: true,
  };
  cssOptions = {
    lineNumbers: true,
    theme: 'ayu-mirage',
    mode: 'css',
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
    autoCloseBrackets: true,
  };
  jsOptions = {
    lineNumbers: true,
    autofocus: true,
    theme: 'ayu-mirage',
    mode: 'javascript',
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
    autoCloseBrackets: true,
  };

  htmlCode: string = '<!-- write your html code here -->';
  htmlChange(code: Event): void {
    this.htmlCode = code + '';
  }

  cssCode: string = '/* write your css code here */';
  cssChange(code: Event): void {
    this.cssCode = code + '';
  }

  jsCode: string = '// write your js code here';
  jsChange(code: Event): void {
    this.jsCode = code + '';
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

  ngOnDestroy(): void {
    this._titleService.setTitle('CODEBOX');
    this.leaveFromLive(this.owner._id, this.room, this.isCreator);
    this._socketService.disconnect();
    clearInterval(this.iconInterval);
    this._ngxFavIcon.setFavicon('favicon.ico');
    this.closeDropDown();
    this.subs_owner?.unsubscribe();
    this.subs_isConnected?.unsubscribe();
  }
}
