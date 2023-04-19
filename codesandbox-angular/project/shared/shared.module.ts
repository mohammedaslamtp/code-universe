import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatSnackBarModule,
  MatSnackBarVerticalPosition,
  MatSnackBarHorizontalPosition,
} from '@angular/material/snack-bar';


@NgModule({
  declarations: [],
  imports: [CommonModule, MatSnackBarModule],
  providers: [],
})
export class SharedModule {
  exp = [MatSnackBarModule];
}
