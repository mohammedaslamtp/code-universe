import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';

@Component({
  selector: 'app-all-codes',
  templateUrl: './all-codes.component.html',
  styleUrls: ['./all-codes.component.css'],
})
export class AllCodesComponent implements OnDestroy {
  templates!: Templates;
  subs_templates!: Subscription;
  ownTemplates!: Templates;
  userData!: USerData;
  subs_userData!: Subscription;
  subs_userId: Subscription;
  userId: string | null = '';
  userName: string | null = '';
  empty: boolean = false;
  isLoading: boolean = false;
  constructor(
    private _userService: UserService,
    private _activatedRoute: ActivatedRoute,
    private _router: Router
  ) {
    // getting user data
    this.subs_userId = this._activatedRoute.paramMap.subscribe((param) => {
      this.isLoading = true;
      if (param.get('id')) {
        this.userId = param.get('id');
      } else if (param.get('username')) {
        this.userName = param.get('username');
      } else {
        this._router.navigate(['**']);
      }
      this.subs_userData = this._userService.getUserData().subscribe((data) => {
        this.userData = data;

        // getting all templates
        this.subs_templates = this._userService
          .getTemplates()
          .subscribe((data: any) => {
            this.templates = data?.all_templates;
            // filtering own templates
            this.ownTemplates = this.templates.filter(
              (el) => el.isPrivate == false && el.user._id == this.userData._id
            );
            this.isLoading = false;
            if (this.ownTemplates.length == 0) {
              this.empty = true;
              this.isLoading = false;
            } else {
              this.empty = false;
              this.isLoading = false;
            }
          });
      });
    });
  }
  ngOnDestroy(): void {
    this.subs_userData.unsubscribe();
    this.subs_templates.unsubscribe();
    this.subs_userId.unsubscribe();
  }
}
