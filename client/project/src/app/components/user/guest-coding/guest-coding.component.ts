import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import * as prettier from 'prettier';
import * as htmlParser from 'prettier/parser-html';
import * as jsParser from 'prettier/parser-babel';
import * as cssParser from 'prettier/parser-postcss';
import * as JSZip from 'jszip';
import { saveAs } from 'file-saver';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

import {
  coding,
  logModToggle,
  templateListing,
} from 'src/app/services/shared-values.service';
import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { codesDownload } from 'src/app/stores/actions/downloadCodes';
import {
  downloadCode_errorSelector,
  downloadCode_loadingSelector,
  downloadCode_resultSelector,
} from 'src/app/stores/selector';
import { appStateInterface } from 'src/app/types/appState';
import { CodesForDownload } from 'src/app/types/downloadCode';
import { ActivatedRoute, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';
import { USerData } from 'src/app/types/UserData';

@Component({
  selector: 'app-guest-coding',
  templateUrl: './guest-coding.component.html',
  styleUrls: ['./guest-coding.component.css'],
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('visible => hidden', animate('300ms ease-out')),
      transition('hidden => visible', animate('300ms ease-in')),
    ]),
  ],
})
export class GuestCodingComponent implements OnInit, OnDestroy {
  // confirmation for reaload
  @HostListener('window:beforeunload', ['$event'])
  confirmExit(event: BeforeUnloadEvent): void {
    event.preventDefault();
    event.returnValue = 'Are you sure you want to reload this page?';
  }

  @ViewChild('result', { static: true })
  iFrame!: ElementRef<HTMLIFrameElement>;
  @ViewChild('title', { static: true })
  titleHead!: ElementRef;
  isLoading: boolean = true;
  isLoggedIn!: boolean;
  subs_userData?: Subscription;
  toggle: boolean = false;
  saved: boolean = false;
  templateId!: string;
  subs_downloadDataLoading!: Subscription;
  subs_downloadDataSuccess!: Subscription;
  subs_downloadDataError!: Subscription;
  downloadLoading$: boolean | null = false;
  downloadCodeResult$!: CodesForDownload;
  downloadCodeError$!: string | null;
  setLogModTrue(bool: boolean) {
    logModToggle.next(bool);
  }
  scriptInserted: boolean = false;
  intervelIdLoading!: any;
  intervelIdResult!: any;
  intervelIdError!: any;
  param!: string;
  subs_param!: Subscription;
  userData!: USerData;
  isOwner: boolean = false;
  subs_TemplateDetail!: Subscription;
  subs_option!: Subscription;
  htmlOptions: any;
  cssOptions: any;
  jsOptions: any;

  formatOnSave: boolean = true;

  constructor(
    private _userService: UserService,
    private _mainService: MainService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router,
    private _store: Store<appStateInterface>
  ) {
    // updating download loading from state
    this.subs_downloadDataLoading = this._store
      .pipe(select(downloadCode_loadingSelector))
      .subscribe((loading) => {
        if (loading == true) {
          this.downloadLoading$ = loading;
        }
      });

    // updating download success state
    this.subs_downloadDataSuccess = this._store
      .pipe(select(downloadCode_resultSelector))
      .subscribe((data: any) => {
        this.downloadCodeResult$ = data;
      });

    // updating download error state
    this.subs_downloadDataError = this._store
      .pipe(select(downloadCode_errorSelector))
      .subscribe((e: any) => {
        if (e) {
          console.log(e.error);
          this.downloadCodeError$ = e.error;
        }
      });
  }

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

  ngOnInit(): void {
    coding.next(true);

    if (this._userService.loggedIn()) {
      this.isLoggedIn = true;
      this.subs_userData = this._userService.getUserData().subscribe((res) => {
        this.userData = res;
        this.subs_option = this._mainService
          .getEditorDetail(res._id)
          .subscribe((val: any) => {
            this.formatOnSave = val.data.formatOnSave;
            // codemirror options
            // html
            this.htmlOptions = {
              lineNumbers: val.data.lineNumbers ? true : false,
              autofocus: true,
              theme: val.data.theme,
              mode: 'html',
              showCursorWhenSelecting: true,
              lineWiseCopyCut: true,
              linerWrapping: val.data.linerWrapping ? true : false,
              tabSize: val.data.tabSize,
            };
            // css
            this.cssOptions = {
              lineNumbers: val.data.lineNumbers ? true : false,
              theme: val.data.theme,
              mode: 'css',
              showCursorWhenSelecting: true,
              lineWiseCopyCut: true,
              extraKeys: val.data.suggestion,
              linerWrapping: val.data.linerWrapping ? true : false,
              tabSize: val.data.tabSize,
            };
            // js
            this.jsOptions = {
              lineNumbers: val.data.lineNumbers ? true : false,
              theme: val.data.theme,
              mode: 'javascript',
              extraKeys: val.data.suggestion,
              showCursorWhenSelecting: true,
              lineWiseCopyCut: true,
              autoCloseBrackets: true,
              linerWrapping: val.data.linerWrapping ? true : false,
              tabSize: val.data.tabSize,
            };
          });
      });
    } else {
      this.isLoggedIn = false;
      // html
      this.htmlOptions = {
        lineNumbers: true,
        autofocus: true,
        theme: 'ayu-mirage',
        mode: 'html',
        showCursorWhenSelecting: true,
        lineWiseCopyCut: true,
        linerWrapping: true,
        tabSize: 4,
      };
      // css
      this.cssOptions = {
        lineNumbers: true,
        theme: 'ayu-mirage',
        mode: 'css',
        showCursorWhenSelecting: true,
        lineWiseCopyCut: true,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
        linerWrapping: true,
        tabSize: 4,
      };
      // js
      this.jsOptions = {
        lineNumbers: true,
        theme: 'ayu-mirage',
        mode: 'javascript',
        showCursorWhenSelecting: true,
        lineWiseCopyCut: true,
        linerWrapping: true,
        tabSize: 4,
        extraKeys: { 'Ctrl-Space': 'autocomplete' },
      };
    }

    this.subs_param = this._activatedRoute.params.subscribe((param) => {
      this.param = param['id'];
      if (this.param !== 'new') {
        templateListing.next(true);
        this.subs_TemplateDetail = this._mainService
          .getTemplateDetail(this.param)
          .subscribe(
            (res) => {
              this.saved = true;
              this.title = res.data.title;
              this.htmlCode = res.data.html;
              this.cssCode = res.data.css;
              this.jsCode = res.data.js;
              this.templateId = res.data.template_id;
              this.titleHead.nativeElement.textContent = this.title;
              console.log(res.data.user);

              if (res.data.user._id == this.userData?._id) {
                this.isOwner = true;
                templateListing.next(false);
                this.random = res.data.template_id;
              }
              this.htmlCode = res.data.html;
              this.cssCode = res.data.css;
              this.jsCode = res.data.js;
              setTimeout(() => {
                this.formatHTMLCode();
                this.formatCSSCode();
                this.formatJSCode();
                this.codeRun();
              }, 200);
            },
            (err) => {
              this._router.navigate(['**']);
            }
          );
      }
    });

    window.addEventListener('message', this.receiveMessage.bind(this));

    // resizing style
    const dataDiv: any = document.getElementById('data');
    const inner1Div: any = document.getElementById('html-header');
    const inner2Div: any = document.getElementById('html');
    const inner3Div: any = document.getElementById('css-header');
    const inner4Div: any = document.getElementById('css');
    const inner5Div: any = document.getElementById('js-header');
    const inner6Div: any = document.getElementById('js');
    const resizerDiv: any = document.getElementById('resizer');

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
      }
      lastDownX = e.clientX;
    });
    document.addEventListener('mouseup', (e: any) => {
      isResizing = false;
    });
  }

  // javascirpt errors for console
  receiveMessage(event: MessageEvent) {
    if (event.data.type == 'framError') {
      console.log('Received data from iframe:', event.data.message);
    }
  }

  // code run
  random!: string;
  codeRun() {
    const title = document.getElementById('editable');
    this._userService
      .runCode(
        this.htmlCode,
        this.cssCode,
        this.jsCode,
        title?.innerText,
        this.random
      )
      .subscribe(
        (data) => {
          this.random = data.template_id;
          this._userService.reloadIframe(data.template_id).subscribe(
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
    this.editable = document.querySelector('#editable');
    if (this.param === 'new' || this.isOwner) {
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
    } else {
      this.editable.contentEditable = 'false';
      this.editable.style.backgroundColor = '';
    }
  }

  title!: string;
  getTitle(): void {
    const title = document.querySelector('#editable')?.textContent;
    this.title = String(title);
  }

  // save code
  subs_runCode!: Subscription;
  saveCode() {
    // running code before saving
    this.getTitle();
    if (this.formatOnSave) {
      this.formatHTMLCode();
      this.formatCSSCode();
      this.formatJSCode();
    }
    this.subs_runCode = this._userService
      .runCode(
        this.htmlCode,
        this.cssCode,
        this.jsCode,
        this.title,
        this.random
      )
      .subscribe(
        (data) => {
          this.codeRun();
          this.random = data.template_id;
          // saving code after end running code
          this._userService
            .saveCode(
              this.title,
              this.htmlCode,
              this.cssCode,
              this.jsCode,
              this.random
            )
            .subscribe(
              (res) => {
                this.saved = true;
                if (res.saved) {
                  this.templateId = res?.templateId;
                  const Toast = Swal.mixin({
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                      toast.addEventListener('mouseenter', Swal.stopTimer);
                      toast.addEventListener('mouseleave', Swal.resumeTimer);
                    },
                  });
                  Toast.fire({
                    icon: 'success',
                    title: 'Saved in successfully',
                  });
                }
              },
              (err) => {
                console.log('backend error: ', err);
                if (!err.saved) {
                  this.saved = false;
                }
              }
            );
        },
        (err) => {
          console.log(err);
        }
      );
  }

  // for guestUser only
  popup() {
    if (this._userService.loggedIn()) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
      this.toggle = true;
    }
  }

  // to format html codes
  formatHTMLCode(): void {
    if (this.htmlCode) {
      const formattedCode = prettier.format(this.htmlCode, {
        parser: `html`,
        plugins: [htmlParser],
        htmlWhitespaceSensitivity: 'strict',
      });
      this.htmlCode = formattedCode;
    }
  }

  // to format css codes
  formatCSSCode(): void {
    if (this.cssCode) {
      const formattedCode = prettier.format(this.cssCode, {
        parser: `css`,
        plugins: [cssParser],
        htmlWhitespaceSensitivity: 'strict',
      });
      this.cssCode = formattedCode;
    }
  }

  // to format js codes
  formatJSCode() {
    if (this.jsCode) {
      const formattedCode = prettier.format(this.jsCode, {
        singleQuote: true,
        trailingComma: 'es5',
        tabWidth: 2,
        parser: 'babel',
        plugins: [jsParser],
        htmlWhitespaceSensitivity: 'strict',
      });
      this.jsCode = formattedCode;
    }
  }

  // combo shortcuts
  pressedKeys: Set<string> = new Set<string>();
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    this.pressedKeys.add(event.key);
    if (this.pressedKeys.has('Control') && this.pressedKeys.has('Enter')) {
      this.codeRun();
    }
  }
  @HostListener('document:keyup', ['$event'])
  onDocumentKeyUp(event: KeyboardEvent) {
    if (event.key) {
      this.pressedKeys.delete(event.key);
    }
  }

  // to download the code as zip file:
  downloadCode(html: string, css: string, js: string) {
    const zip = new JSZip();
    const title = document.getElementById('editable');

    // Add the files to the ZIP
    if (html != '') {
      zip.file('index.html', html);
    }
    if (css != '') {
      zip.file('style.css', css);
    }
    if (js != '') {
      zip.file('script.js', js);
    }
    // Generate the ZIP file asynchronously
    zip
      .generateAsync({ type: 'blob' })
      .then((content) => {
        this.downloadLoading$ = false;
        saveAs(content, `${title?.innerText}-codebox.zip`);
      })
      .catch((error) => {
        this.downloadLoading$ = false;
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
          },
        });
        Toast.fire({
          icon: 'error',
          title: 'Network issue! Please try again..',
        });
      });
  }

  // get codes for download data
  error!: boolean;
  getCodes() {
    if (this._userService.loggedIn()) {
      this._store.dispatch(codesDownload({ id: this.templateId }));
      this.error = false;
    } else {
      this.error = true;
    }

    this.intervelIdLoading = setInterval(() => {
      if (this.downloadLoading$) {
        clearInterval(this.intervelIdLoading);
      }
    }, 1000);
    this.intervelIdResult = setInterval(() => {
      if (this.downloadCodeResult$) {
        this.downloadCode(
          this.downloadCodeResult$.html,
          this.downloadCodeResult$.css,
          this.downloadCodeResult$.js
        );
        clearInterval(this.intervelIdResult);
      }
    }, 1000);
    this.intervelIdError = setInterval(() => {
      if (this.downloadCodeError$) {
        clearInterval(this.intervelIdError);
      }
    }, 1000);
  }

  clearError() {
    this.error = false;
    this.downloadCodeError$ = null;
  }

  closeModal = () => (this.toggle = false);

  login: boolean = false;
  signup: boolean = false;

  loginPage = () => (this.login = true);

  signupPage() {
    this.signup = true;
  }

  ngOnDestroy(): void {
    coding.next(false);
    if ((!this.isLoggedIn && this.random) || !this.saved) {
      this._userService.removeCode(this.random);
    }
    templateListing.next(false);
    this.subs_downloadDataLoading?.unsubscribe();
    this.subs_downloadDataSuccess?.unsubscribe();
    this.subs_downloadDataError?.unsubscribe();
    this.subs_TemplateDetail?.unsubscribe();
    this.subs_userData?.unsubscribe();
    this.subs_param?.unsubscribe();
    this.subs_option?.unsubscribe();
    this.subs_runCode?.unsubscribe();
    this.error = false;
  }
}
