import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
})
export class OtpComponent implements OnInit {
  alert_msg?: string | boolean | null;
  constructor(private userService:UserService){}
  ngOnInit(): void {}

  otp = new FormGroup({
    otp: new FormControl('', [Validators.pattern(/^\d{6}$/)]),
  });

  onSubmit() {
    console.log(this.otp.value);
  }

  close_alert() {
    let alert: any = document.getElementById('alert');
    this.alert_msg = '';
    alert.style.visibility = 'hidden';
  }
}
