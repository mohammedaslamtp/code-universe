import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-ad-login',
  templateUrl: './ad-login.component.html',
  styleUrls: ['./ad-login.component.css'],
})
export class AdLoginComponent implements OnInit {
  error: any;
  constructor(private admin_api: AdminService) {}
  ngOnInit(): void {}

  ad_login = new FormGroup({
    email: new FormControl(null),
    password: new FormControl(null),
  });

  onSubmit() {
    console.log(this.ad_login.value);
    this.admin_api.login(this.ad_login.value).subscribe((result) => {
      console.log(result);
    })
  }
}
