import { Component, OnDestroy, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
// import { QuillEditorComponent } from 'ngx-quill';
import QuillType from 'quill';
import * as Delta from 'quill-delta';


@Component({
  selector: 'app-live-coding',
  templateUrl: './live-coding.component.html',
  styleUrls: ['./live-coding.component.css'],
})
export class LiveCodingComponent implements OnInit, OnDestroy {
  constructor(private _socketService: SocketService) {
    this._socketService.connect();
  }

  ngOnInit() {
    this._socketService.emit('event', 'Hello, world!');
    this._socketService.on('response', (data: any) => {
      console.log(data);
    });
  }

  // resizing iframe
  // resizeIframe(resizeHandle: any) {
  //   let startX = 0;
  //   let startWidth = resizeHandle.parentNode.clientWidth;

  //   const resize = function (e: any) {
  //     console.log('Resizing working');
  //     var width = startWidth + e.clientX - startX;
  //     resizeHandle.parentNode.style.width = width + 'px';
  //   };
  //   const stopResize = function () {
  //     console.log('stopResize working');
  //     window.removeEventListener('mousemove', resize);
  //     window.removeEventListener('mouseup', stopResize);
  //     window.removeEventListener('mouseout', stopResize);
  //   };
  //   resizeHandle.addEventListener(
  //     'mousedown',
  //     function (e: any) {
  //       startX = e.clientX;
  //       window.addEventListener('mousemove', resize);
  //       window.addEventListener('mouseup', stopResize);
  //     }.bind(this)
  //   );
  // }
  //

  content?: string;
  quillConfig = {
    // Add your custom options here
    placeholder: 'Enter text...',
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // Customize the toolbar buttons
      [{ header: 1 }, { header: 2 }], // Customize the header options
      [{ list: 'ordered' }, { list: 'bullet' }], // Customize the list options
      [{ indent: '-1' }, { indent: '+1' }], // Customize the indentation options
      ['link', 'image'], // Customize the link and image options
    ],
  };


  ngOnDestroy(): void {
    this._socketService.disconnect();
  }
}
