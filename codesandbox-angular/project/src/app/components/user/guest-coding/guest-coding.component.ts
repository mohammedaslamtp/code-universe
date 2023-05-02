import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  isDevMode,
  HostListener,
  OnChanges,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import {
  html_editor,
  css_editor,
  js_editor,
} from 'src/assets/code_line_number';
import { FormGroup, FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, map } from 'rxjs';
import { log_dataSelector, log_errorSelector } from 'src/app/stores/selector';
import { Store, select } from '@ngrx/store';
import { appStateInterface } from 'src/app/types/appState';
import { LoginData } from 'src/app/stores/actions/loginAction';
import { LOGIN } from '../login/userLogin';

@Component({
  selector: 'app-guest-coding',
  templateUrl: './guest-coding.component.html',
  styleUrls: ['./guest-coding.component.css'],
})
export class GuestCodingComponent implements OnInit, OnChanges {
  // confirmation for reaload
  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to reload this page?';
  }

  @ViewChild('result', { static: true })
  iFrame!: ElementRef<HTMLIFrameElement>;
  html?: string | null;
  css?: string | null;
  js?: string | null;
  isLoading: boolean = true;
  isLoggedIn: boolean = false;
  data$?: Observable<LOGIN>;
  safeUrl;
  resultUrl =
    'http://' + (isDevMode() ? 'localhost:3000' : 'domain') + '/codeRun';
  constructor(
    private userService: UserService,
    private sanitizer: DomSanitizer,
    private store: Store<appStateInterface>
  ) {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.resultUrl
    );
    this.alert_msg = this.store.pipe(
      select(log_errorSelector),
      map((doc: any) => (this.alert_msg = doc))
    );
    this.alert_msg?.subscribe((doc) => doc);

    this.data$ = this.store.pipe(
      select(log_dataSelector),
      map((doc: any) => (this.data$ = doc))
    );
    this.data$?.subscribe((doc: LOGIN) => doc);
    

    if (this.data$) {
      console.log('constructor: : ', this.isLoggedIn);
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }
  }

  ngOnInit(): void {
    html_editor('html', (data: string | null) => {
      this.html = data;
    });
    css_editor('css', (data: string | null) => {
      this.css = data;
    });
    js_editor('js', (data: string | null) => {
      this.js = data;
    });

    // resizing style
    const dataDiv: any = document.getElementById('data');
    const inner1Div: any = document.getElementById('html-header');
    const inner2Div: any = document.getElementById('html');
    const inner3Div: any = document.getElementById('css-header');
    const inner4Div: any = document.getElementById('css');
    const inner5Div: any = document.getElementById('js-header');
    const inner6Div: any = document.getElementById('js');
    const resizerDiv: any = document.getElementById('resizer');
    const resultWrapperDiv: any = document.getElementById('result-wrapper');
    const resultIFrame: any = document.getElementById('result');
    let isResizing: boolean = false;
    let lastDownX = 0;
    const minWidth = 150;
    const maxWidth = window.innerWidth * 0.8;

    resizerDiv.addEventListener('mousedown', (e: any) => {
      isResizing = true;
      lastDownX = e.clientX;
    });
    document.addEventListener('mousemove', (e: any) => {
      if (!isResizing) return;
      const offsetRight = dataDiv.getBoundingClientRect().right - e.clientX;
      const width = dataDiv.offsetWidth;
      const newWidth = width - (lastDownX - e.clientX);
      if (newWidth > minWidth && newWidth < maxWidth) {
        dataDiv.style.width = newWidth + 'px';
        inner1Div.style.width = newWidth + 'px';
        inner2Div.style.width = newWidth + 'px';
        inner3Div.style.width = newWidth + 'px';
        inner4Div.style.width = newWidth + 'px';
        inner5Div.style.width = newWidth + 'px';
        inner6Div.style.width = newWidth + 'px';

        resultWrapperDiv.style.width = `calc(100% - ${newWidth}px)`;
        resultIFrame.style.width = `100%`;
      }
      lastDownX = e.clientX;
    });
    document.addEventListener('mouseup', (e: any) => {
      isResizing = false;
    });
  }

  // code run
  random!: string | null;
  codeRun() {
    const title = document.getElementById('editable');
    this.userService
      .runCode(this.html, this.css, this.js, title?.innerText, this.random)
      .subscribe(
        (data) => {
          // console.log('after code saved ', data);
          this.random = data.template_id;
          this.userService.reloadIframe(data.template_id).subscribe(
            (response: any) => {
              if (response) this.isLoading = false;
              const blob = new Blob([response], { type: 'text/html' });
              const url = URL.createObjectURL(blob);
              this.iFrame.nativeElement.src = url;
            },
            (err) => {
              console.log(err);
            }
          );
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // title editable
  editable!: any;
  toggleEdit() {
    this.editable = document.getElementById('editable');
    if (this.editable.contentEditable == 'true') {
      // disable editing
      this.editable.contentEditable = 'false';
      this.editable.style.backgroundColor = '';
    } else {
      // enable editing
      this.editable.contentEditable = 'true';
      this.editable.style.backgroundColor = '';
      this.editable.focus();
      let selection = window.getSelection();
      let range = document.createRange();
      range.selectNodeContents(this.editable);
      selection?.removeAllRanges();
      selection?.addRange(range);
    }
  }

  // save code
  saveCode() {
    // code here..
    console.log('save code...');
  }

  alert_msg?: Observable<string> | string;
  // login data
  login = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  // login user
  loginSubmit() {
    console.log('login form: ', this.login.value);
    this.store.dispatch(LoginData({ login: this.login.value }));
  }

  // closing alert msg
  close_alert() {
    let alert: any = document.getElementById('alert');
    this.alert_msg = '';
    alert.style.visibility = 'hidden';
  }

  ngOnChanges() {
    console.log('onchanges working...');
    console.log('user data: ',this.data$)
  }
}
