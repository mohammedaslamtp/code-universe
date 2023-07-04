import { Component } from '@angular/core';
import 'codemirror/addon/hint/html-hint';

@Component({
  selector: 'app-following',
  templateUrl: './following.component.html',
  styleUrls: ['./following.component.css'],
})
export class FollowingComponent {
  data: string = '';

  constructor() {
    
    const cdn1 = document.createElement('script');
    cdn1.src =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/javascript-hint.min.js';
    const cdn2 = document.createElement('script');
    cdn2.src =
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/6.65.7/addon/hint/show-hint.min.js';
    const cdn3 = document.createElement('script');
    cdn3.src =
    'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/addon/edit/closebrackets.min.js';
    const cdn4 = document.createElement('script');
    cdn4.src =
      'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.62.0/codemirror.min.js';

    document.head.appendChild(cdn1);
    document.head.appendChild(cdn2);
    document.head.appendChild(cdn3);
    document.head.appendChild(cdn4);
  }

  options = {
    lineNumbers: true,
    autofocus: true,
    theme: 'ayu-mirage',
    mode: 'javascript',
    extraKeys: { 'Ctrl-Space': 'autocomplete' },
    
    showCursorWhenSelecting:true,
    lineWiseCopyCut:true,
    autoCloseBrackets: true 

  };

  handleChange(code: Event): void {
    this.data = code + '';
    console.log(code);
  }
}