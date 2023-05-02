import {
  Directive,
  ElementRef,
  EventEmitter,
  OnDestroy,
  Output,
} from '@angular/core';

@Directive({
  selector: '[appCodeMirrorChangeDetector]'
})
export class CodeMirrorChangeDetectorDirective {

  constructor() { }

}
