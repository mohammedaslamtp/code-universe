import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { UserService } from 'src/app/services/user.service';
// import {
//   html_editor,
//   css_editor,
//   js_editor,
//   updateFormatedCode,
// } from 'src/assets/code_line_number';
import Swal from 'sweetalert2';
import * as prettier from 'prettier';
import * as htmlParser from 'prettier/parser-html';
import * as jsParser from 'prettier/parser-babel';
import * as cssParser from 'prettier/parser-postcss';



import { coding, logModToggle } from 'src/app/services/shared-values.service';
// import {CodeMirror} from'@codemirror-toolkit/react'
@Component({
  selector: 'app-guest-coding',
  templateUrl: './guest-coding.component.html',
  styleUrls: ['./guest-coding.component.css'],
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
  html?: string | null;
  css?: string | null;
  js?: string | null;
  intervalId: any;
  isLoading: boolean = true;
  isLoggedIn!: boolean;
  toggle: boolean = false;
  setLogModTrue(bool: boolean) {
    logModToggle.next(bool);
  }

  constructor(private _userService: UserService) {}

  ngOnInit(): void {
    coding.next(true);
    window.addEventListener('message', this.receiveMessage.bind(this));
    // html_editor('html', (data: string | null) => {
    //   this.html = data;
    // });
    // css_editor('css', (data: string | null) => {
    //   this.css = data;
    // });
    // js_editor('js', (data: string | null) => {
    //   this.js = data;
    // });

    if (localStorage.getItem('token')) {
      this.isLoggedIn = true;
    } else {
      this.isLoggedIn = false;
    }

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

    // checking user logged in or not regularly and updating
    this.intervalId = setInterval(() => {
      if (localStorage.getItem('token')) {
        this.isLoggedIn = true;
      } else {
        this.isLoggedIn = false;
      }
    }, 1000);
    this.codeRun();
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
      .runCode(this.html, this.css, this.js, title?.innerText, this.random)
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
  saved: boolean = false;
  saveCode() {
    // running code before saving
    const title = document.getElementById('editable');
    this._userService
      .runCode(this.html, this.css, this.js, title?.innerText, this.random)
      .subscribe(
        (data) => {
          this.random = data.template_id;
          // saving code after end running code
          this._userService
            .saveCode(
              title?.innerText,
              this.html,
              this.css,
              this.js,
              this.random
            )
            .subscribe(
              (res) => {
                this.saved = true;
                if (res.saved) {
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
  CodeForFormat!: string;
  formatHTMLCode(): string {
    this.CodeForFormat = this.html + '';
    const formattedCode = prettier.format(this.CodeForFormat, {
      parser: `html`,
      plugins: [htmlParser],
      htmlWhitespaceSensitivity: 'strict',
    });
    // updateFormatedCode('html', formattedCode);
    let code = document.querySelectorAll("#html .CodeMirror-code")



    // let preCode = document.querySelector('pre')
    console.log(code)
    console.log(formattedCode)
    this.html = formattedCode;
    return formattedCode;
  }


  // to format css codes
  formatCSSCode(): string {
    this.CodeForFormat = this.css + '';
    const formattedCode = prettier.format(this.CodeForFormat, {
      parser: `css`,
      plugins: [cssParser],
      htmlWhitespaceSensitivity: 'strict',
    });
    return formattedCode;
  }

  // to format js codes
  formatJSCode(): string {
    this.CodeForFormat = this.js + '';
    const formattedCode = prettier.format(this.CodeForFormat, {
      singleQuote: true,
      trailingComma: 'es5',
      tabWidth: 2,
      parser: 'babel',
      plugins: [jsParser],
      htmlWhitespaceSensitivity: 'strict',
    });
    return formattedCode;
  }

  closeModal = () => (this.toggle = false);

  login: boolean = false;
  signup: boolean = false;

  loginPage = () => (this.login = true);

  signupPage() {
    this.signup = true;
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    coding.next(false);
    if ((!this.isLoggedIn && this.random) || !this.saved) {
      this._userService.removeCode(this.random);
    }
  }
}
