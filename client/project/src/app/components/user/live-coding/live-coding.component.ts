import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { CodemirrorComponent } from '@ctrl/ngx-codemirror';
import Swal from 'sweetalert2';
import { skipWork } from 'src/app/guard/live-coding.guard';
import { Position } from 'codemirror';

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
    event.returnValue = 'Are you sure you want to leave this page?';
  }

  constructor(
    private _socketService: SocketService,
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _titleService: Title,
    private _ngxFavIcon: AngularFaviconService,
    private _router: Router
  ) {}

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
      this.liveLoading = false;
      this._router.navigate(['**']);
    });

    // socket connection:
    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      this.liveLoading = true;
      if (param['room']) {
        this.room = param['room'];
        this._socketService.emit('isRoomExist', String(param['room']));
        this._socketService.on('validRoom', (valid) => {
          if (valid) {
            this.subs_owner = this._userService
              .getUserData()
              .subscribe((data) => {
                this.owner = data;
                this.joinToLive(data._id, param['room'], this.isCreator);
                setTimeout(() => {
                  this.liveLoading = false;
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

    // update html code
    this._socketService.on('htmlCode', (data) => {
      const cmInstance = this.htmlEditor.codeMirror;
      const newCharacterPosition = {
        line: data.position.line,
        ch: data.position.ch,
      };
      cmInstance?.replaceRange(data.code, newCharacterPosition);
    });

    // fetching connected users
    this._socketService.on('connectedClients', (data) => {
      this.connectedUsers = data;
    });

    // if live end
    this._socketService.on('liveEnd', (alert) => {
      skipWork.next(true);
      this.endSwal(alert);
    });

    // initial code fetch
    this._socketService.on('initialHtmlEmit', (data) => {
      this.htmlCode = data;
    });

    // adding new line
    this._socketService.on('newLine', (line) => {
      this.htmlEditor.codeMirror?.replaceRange('\n', { line, ch: 0 });
    });

    // backspace press
    this._socketService.on('backspacePress', (data) => {
      const cmInstance = this.htmlEditor.codeMirror;
      console.log('backspacePress', data);

      if (data.position.ch == 0 && data.position.line > 0) {
        let lineContent = '';
        if (cmInstance?.getLine(data.position.line) !== undefined) {
          lineContent = cmInstance?.getLine(data.position.line);
          console.log('line content: ', lineContent);
        }
        const prevLine = data.position.line - 1;
        const prevLineEnd = cmInstance?.getLineHandle(prevLine)?.text.length;
        console.log('prev line len: ', prevLineEnd);
        cmInstance?.replaceRange(lineContent, {
          line: prevLine,
          ch: prevLineEnd as number,
        });
        cmInstance?.replaceRange('', {
          line: data.position.line,
        } as Position);
      } else {
        cmInstance?.replaceRange(
          '',
          {
            line: data.position.line,
            ch: data.position.ch + 1,
          },
          { line: data.position.line, ch: data.position.ch }
        );
      }
    });

    // backspace press
    this._socketService.on('ctrlBackspacePress', (data) => {
      const cmInstance = this.htmlEditor.codeMirror;
      const wordStart = { line: data.position.line, ch: data.position.ch };
      const range = cmInstance?.findWordAt(wordStart);
      console.log('wordStart ', wordStart);
      if (range) cmInstance?.replaceRange('', range?.anchor, range?.head);
    });
  }

  // Live end alert
  endSwal(alert: string) {
    let timerInterval: any;
    Swal.fire({
      title: alert,
      html: 'The live already end. Going to redirect <b></b>',
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const b: any = Swal.getHtmlContainer()?.querySelector('b');
        timerInterval = setInterval(() => {
          b.textContent = Swal.getTimerLeft();
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
      },
    }).then((result) => {
      if (result.dismiss === Swal.DismissReason.timer) {
        this._router.navigate(['/createLive']);
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
  leaveFromLive(userId: string, roomId: string) {
    this._socketService.emit('leaveRoom', {
      userId: userId,
      roomId: roomId,
    });
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

  // set cursor position
  htmlCursor!: Position | undefined;
  setCursor(position: Position | number | undefined, lang: string) {
    if (position) {
      if (lang === 'html') {
        this.htmlEditor.codeMirror?.setCursor(position);
      }
    }
  }

  // updating cursor position in every mouse click
  getCursor(event: Event | MouseEvent | KeyboardEvent, lang: string) {
    if (
      (event.type == 'click' || event.type == 'contextmenu') &&
      lang === 'html'
    ) {
      console.log('event: ', event);
      this.htmlPrivateCursorPosition = this.htmlEditor.codeMirror?.getCursor();
    }
    if (lang === 'html') {
      this.htmlCursor = this.htmlEditor.codeMirror?.getCursor();
    }
  }

  // to get selection range
  selectionRange(event: Event) {
    this.getCursor(event, 'html');
    const selsectionStart = this.htmlEditor.codeMirror?.getCursor('start');
    const selsectionEnd = this.htmlEditor.codeMirror?.getCursor('end');
    console.log('start: ', selsectionStart);
    console.log('end: ', selsectionEnd);
  }

  // copy paste caughting
  pasteCode(event: ClipboardEvent, lang: string): void {
    const pasteData = event.clipboardData?.getData('text');
    console.log(pasteData);
    if (pasteData) {
      if (lang === 'html') {
        // this._socketService.emit('html', { position: cursor, code: code.key });
      }
    }
  }

  htmlPrivateCursorPosition: Position | undefined;
  htmlCode!: string;
  htmlChange(code: KeyboardEvent): void {
    const cursor = this.htmlEditor.codeMirror?.getCursor();
    console.log('cursor position: ', cursor);
    console.log(code.key);
    // if press backspace
    if (code.key === 'Backspace') {
      console.log('backspace position: ', cursor);
      let pos = cursor;
      if (cursor?.ch == 0) {
        pos = this.htmlPrivateCursorPosition;
      }
      this._socketService.emit('Backspace', { position: pos });
    }
    // updating private cursor position
    if (
      code.key == 'Enter' ||
      code.key == 'ArrowRight' ||
      code.key == 'ArrowLeft' ||
      code.key == 'ArrowDown' ||
      code.key == 'ArrowUp'
    ) {
      this.htmlPrivateCursorPosition = cursor;
    }

    // adding new line
    if (code.key === 'Enter') {
      if (cursor) {
        const line = cursor.line;
        this._socketService.emit('addNewLine', { line: line });
      }
    }

    if ((code.ctrlKey || code.metaKey) && code.key === 'Backspace') {
      this._socketService.emit('ctrlAndBackspace', { position: cursor });
    }

    if (code.key.length == 1) {
      this._socketService.emit('html', { position: cursor, code: code.key });
    }
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
    this.leaveFromLive(this.owner?._id, this.room);
    clearInterval(this.iconInterval);
    this._ngxFavIcon.setFavicon('favicon.ico');
    this.closeDropDown();
    // this._socketService.disconnect();
    this.subs_owner?.unsubscribe();
    this.subs_param?.unsubscribe();
    this.subs_roomid?.unsubscribe();
    this.subs_isConnected?.unsubscribe();
  }
}
