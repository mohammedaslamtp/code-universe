import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CodeMirrorChangeDetectorDirective } from './code-mirror-change-detector.directive';



@NgModule({
  declarations: [
    CodeMirrorChangeDetectorDirective
  ],
  imports: [
    CommonModule
  ]
})
export class SharedModule { }
