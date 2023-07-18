import { Component } from '@angular/core';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FollowingComponent {
  data: string = '';

  options = {
    lineNumbers: true,
    autofocus: true,
    theme: 'material',
    mode: 'css',
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    showCursorWhenSelecting: true,
    lineWiseCopyCut: true,
    linerWrapping: true,
    autoCloseBrackets: true,
  };

  handleChange(code: Event): void {
    this.data = code + '';
    console.log(code);
  }
}
