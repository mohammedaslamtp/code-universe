import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';

@Component({
  selector: 'app-live-coding',
  templateUrl: './live-coding.component.html',
  styleUrls: ['./live-coding.component.css'],
})
export class LiveCodingComponent implements OnInit, OnDestroy {
  connectedUsers!: [USerData];
  owner!: USerData;
  roomId!: string;
  subs_owner!: Subscription;
  constructor(
    private _socketService: SocketService,
    private _userService: UserService
  ) {}
  ngOnInit() {
    // socket connection:
    this._socketService.connect();
    this.subs_owner = this._userService.getUserData().subscribe((data) => {
      this.owner = data;
      this.joinToLive(data._id);
    });

    // socket data passing:
    this._socketService.emit('event', 'Hello world!');
    // socket response receiving:
    this._socketService.on('roomId', (roomId) => {
      this.roomId = roomId;
    });
  }

  // join to room
  joinToLive(clientId: string) {
    this._socketService.emit('client', clientId);
    this._socketService.on('connectedClients', (data) => {
      this.connectedUsers = data;
      console.log('users: ', this.connectedUsers);
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

  ngOnDestroy(): void {
    // socket disconnecting:
    this._socketService.disconnect();
    this.subs_owner?.unsubscribe();
  }
}
