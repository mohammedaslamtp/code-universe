import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/internal/Subscription';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';


@Component({
  selector: 'app-editor-preferences',
  templateUrl: './editor-preferences.component.html',
  styleUrls: ['./editor-preferences.component.css'],
})
export class EditorPreferencesComponent implements OnInit {
  userData!: USerData;
  subs_userData: Subscription;
  constructor(private _userService: UserService, private _router: Router) {
    this.subs_userData = this._userService.getUserData().subscribe(
      (data) => {
        this.userData = data;
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );
  }

  exampleHtml = `<h1 id="heading">Hello World</h1>
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

  options = {
    lineNumbers: true,
    autofocus: true,
    theme: 'material',
    mode: 'htmlmixed',
    readOnly: true,
    tabSize: 4,
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
    autoCloseBrackets: true,
    
  };

  themeChange(form: NgForm) {
    console.log('form value: ', form.value);
  }
}
