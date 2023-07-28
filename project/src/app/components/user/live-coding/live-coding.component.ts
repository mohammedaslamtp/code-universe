import {
  Component,
  DoCheck,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import {
  client,
  socketConnected,
} from 'src/app/services/shared-values.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Title } from '@angular/platform-browser';
import { AngularFaviconService } from 'angular-favicon';
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';

const realRoomId = new BehaviorSubject<string>('empty');

@Component({
  selector: 'app-live-coding',
  templateUrl: './live-coding.component.html',
  styleUrls: ['./live-coding.component.css'],
})
export class LiveCodingComponent implements OnInit, OnDestroy, DoCheck {
  isToggledUsers: boolean = false;
  connectedUsers!: [USerData];
  owner!: USerData;
  isCreator: boolean = false;
  room!: string;
  liveLoading: boolean = false;

  subs_owner!: Subscription;
  subs_isConnected!: Subscription;
  subs_connectedUsers!: Subscription;
  subs_param!: Subscription;
  subs_roomid!: Subscription;

  @ViewChild('htmlEditor', { static: false })
  htmlEditor!: CodemirrorComponent;

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
    private _ngxFavIcon: AngularFaviconService,
    private _router: Router
  ) {}

  htmlCursor!: number;
  ngDoCheck(): void {
    // console.log('do check works')
  }

  error!: string;
  ngOnInit() {
    setTimeout(() => {
      this._socketService.connect();
      this.subs_isConnected = socketConnected.subscribe((val) => {
        if (val === 'creator') {
          this.isCreator = true;
        } else if (val === 'member') {
          this.isCreator = false;
        } else {
          this.isCreator = false;
        }
      });
    }, 0);

    // changing title of web component
    this._titleService.setTitle('CODEBOX LIVE');

    // invalid entry!
    this._socketService.on('room-not-found', (err) => {
      console.log(err);
      this.liveLoading = false;
      this._router.navigate(['**']);
    });

    // socket connection:
    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      this.liveLoading = true;
      this.room = param['room'];
      if (param['room']) {
        
        this._socketService.emit('isRoomExist', String(param['room']));
        this._socketService.on('validRoom', (valid) => {
          console.log('working');
          if (valid) {
            this.subs_owner = this._userService
              .getUserData()
              .subscribe((data) => {
                this.owner = data;
                this.joinToLive(data._id, param['room'], this.isCreator);
                this.liveLoading = false;
                setTimeout(() => {
                  this._ngxFavIcon.setFavicon(
                    `${client}/assets/images/liveStroke2/favicon.ico`
                  );
                  this.toggleFavicon();
                }, 3000);
              });
          }
        });
      }
    });

    this.subs_roomid = realRoomId.subscribe((val) => {
      this.room = val;
    });

    // update code
    this._socketService.on('code', (code) => {
      this.htmlCode = code;
      console.log('code', code);
      this.moveCursor(1, 5);
    });

    // fetching connected users
    this._socketService.on('connectedClients', (data) => {
      console.log('online ', data);
    });
  }

  moveCursor(line: number, position: number) {
    setTimeout(() => {
      this.htmlEditor.codeMirror?.setCursor(position);
    }, 0);
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
    if (isCreator) {
      this._socketService.emit('createRoom', {
        userId: userId,
        roomId: roomId,
      });
    } else {
      this._socketService.emit('joinRoom', {
        userId: userId,
        roomId: roomId,
      });
    }
  }

  // leave from room
  leaveFromLive(userId: string, roomId: string, isCreator: boolean) {
    this._socketService.emit('leaveRoom', {
      userId: userId,
      roomId: roomId,
      isCreator: isCreator,
    });
    this._socketService.disconnect();
  }

  // editor options and setup:
  htmlOptions = {
    lineNumbers: true,
    autofocus: true,
    theme: 'ayu-mirage',
    mode: 'html',
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
  };
  cssOptions = {
    lineNumbers: true,
    theme: 'ayu-mirage',
    mode: 'css',
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
  };
  jsOptions = {
    lineNumbers: true,
    theme: 'ayu-mirage',
    mode: 'javascript',
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
  };

  htmlCode: string = '<!-- write your html code here -->';
  htmlChange(code: Event): void {
    this.htmlCode = code + '';
    this._socketService.emit('data', code);
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
    this.leaveFromLive(this.owner?._id, this.room, this.isCreator);
    clearInterval(this.iconInterval);
    this._ngxFavIcon.setFavicon('favicon.ico');
    this.closeDropDown();
    this.subs_owner?.unsubscribe();
    this.subs_param?.unsubscribe();
    this.subs_roomid?.unsubscribe();
    this.subs_isConnected?.unsubscribe();
  }
}
