import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import 'codemirror/mode/htmlmixed/htmlmixed';
import { MainService } from 'src/app/services/main.service';
import Swal from 'sweetalert2';
import { SettingsService } from 'src/app/services/settings.service';
import { appStateInterface } from 'src/app/types/appState';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  fontSize_resultSelector,
  tabSize_resultSelector,
} from '../../../stores/selector';
import { apiRes } from 'src/app/types/defulatApiRes';
import { changeFontSize } from 'src/app/stores/actions/changeFontSize';
import { changeTabSize } from 'src/app/stores/actions/changeTabSize';

@Component({
  selector: 'app-editor-preferences',
  templateUrl: './editor-preferences.component.html',
  styleUrls: ['./editor-preferences.component.css'],
})
export class EditorPreferencesComponent implements OnInit, OnDestroy {
  isHtml: boolean = false;
  isCss: boolean = false;
  isJs: boolean = false;
  userData!: USerData;
  subs_userData!: Subscription;
  options!: any;
  subs_options!: Subscription;
  theme!: string;
  mode: string = 'js';
  fontSize!: number;
  tabSize!: number;
  fontSizeData!: Observable<apiRes>;
  tabSizeData!: Observable<apiRes>;

  // form options
  lineNumbers: boolean = true;
  lineWrapping: boolean = true;
  suggestions: boolean = true;
  formatOnSave: boolean = true;

  constructor(
    private _userService: UserService,
    private _mainService: MainService,
    private _settingsService: SettingsService,
    private _router: Router,
    private store: Store<appStateInterface>
  ) {
    this.adjustMode();
  }

  adjustMode() {
    this.subs_userData = this._userService.getUserData().subscribe(
      (data) => {
        this.userData = data;
        this.subs_options = this._mainService
          .getEditorDetail(data._id)
          .subscribe((res) => {
            this.fontSize = res.data.fontSize;
            this.tabSize = res.data.tabSize;
            this.theme = res.data.theme;
            this.lineNumbers = res.data.lineNumbers;
            this.options = {
              lineNumbers: this.lineNumbers,
              autofocus: true,
              theme: res.data.theme,
              mode: this.mode,
              readOnly: true,
              tabSize: this.tabSize,
              extraKeys: { 'Ctrl-Space': 'autocomplete' },
              showCursorWhenSelecting: true,
              lineWiseCopyCut: true,
              linerWrapping: true,
            };
          });
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );
  }

  exampleCode = `<h1 id="heading">Hello World</h1>
  <p>
    Greetings, earthlings!
    <a href='#'>I'm a link</a>
  </p>
  
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <circle cx="50" cy="50" r="50" fill="#F00">
  </svg>
  
  <ol class="list">
    <li>One</li>
    <li>Two</li>
  </ol>
  <!-- /.list -->`;

  ngOnInit(): void {
    this.changeSampleCode('css');

    // font size updation success
    this.store.pipe(select(fontSize_resultSelector)).subscribe((doc: any) => {
      if (doc != null) {
        this.swalAlert(doc.status, doc.message);
      }
      return doc;
    });

    // tab size updation success
    this.store.pipe(select(tabSize_resultSelector)).subscribe((doc: any) => {
      if (doc != null) {
        console.log(doc);
        this.swalAlert(doc.status, doc.message);
      }
      return doc;
    });

    // javascript hint cdn:
    const javascript_cdn1 = document.createElement('script');
    javascript_cdn1.src =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/javascript-hint.min.js';

    const javascript_cdn2 = document.createElement('script');
    javascript_cdn2.src =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/show-hint.min.js';
    document.head.appendChild(javascript_cdn1);
    document.head.appendChild(javascript_cdn2);
  }

  changeSampleCode(lang: string) {
    this.mode = lang;
    this.isHtml = false;
    this.isCss = false;
    this.isJs = false;
    if (lang == 'html') {
      this.isHtml = true;
      this.exampleCode = `<h1 id="heading">Hello World</h1>
      <p>
        Greetings, earthlings!
        <a href='#'>I'm a link</a>
      </p>
      
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="50" fill="#F00">
      </svg>

      <ol class="list">
      <li>One</li>
      <li>Two</li>
      </ol>
      <!-- /.list -->`;
    } else if (lang == 'css') {
      this.isCss = true;
      this.exampleCode = `html, body {
        height: 100%; /* Full Screen */
      }
      body::after {
        content: "foo !== bar"
      }
      @media (min-width: 300px) {
        .cool {
          padding: 5%;
        }
      }`;
    } else if (lang == 'javascript') {
      this.isJs = true;
      this.exampleCode = `var token = true;
      function appendEl(text){
      document
      .body
      .insertAdjacentHTML(
        'beforeend',      
        );
      }
      appendEl('Text added by JS');
        `;
    }
    this.adjustMode();
  }

  // to change theme of editor
  themeChange(form: NgForm) {
    if (form.value.theme != null)
      this._settingsService.chageTheme(form.value.theme).subscribe(
        (data) => {
          this.adjustMode();
          this.options = data;
          this.theme = data.data.theme;
          this.swalAlert(data.status, data.message);
        },
        (e) => {
          this.swalAlert(e.error.status, e.error.message);
        }
      );
  }

  // to change font size
  fontSizeSubmit(form: NgForm) {
    const size = parseInt(form.value.fontSize);
    this.store.dispatch(changeFontSize({ fontSize: size }));
  }

  // to change tab size
  tabSizeSubmit(form: NgForm) {
    const size = parseInt(form.value.tabSize);
    this.store.dispatch(changeTabSize({ TabSize: size }));
  }

  // modify editor options
  optionsForm(form: NgForm) {
    console.log('options form: ', form.value);
  }

  swalAlert(status: number, message: string) {
    const Toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: status == 200 ? 'success' : 'error',
      title: message,
    });
  }

  ngOnDestroy(): void {
    this.subs_options?.unsubscribe();
  }
}
