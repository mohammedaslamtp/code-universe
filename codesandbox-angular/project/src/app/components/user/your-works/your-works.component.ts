import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { Templates } from 'src/app/types/template_types';
import { YourWorks } from '../home/home.component';

@Component({
  selector: 'app-your-works',
  templateUrl: './your-works.component.html',
  styleUrls: ['./your-works.component.css'],
})
export class YourWorksComponent implements OnDestroy {
  subs_UserData_collector: Subscription;
  UserData!: USerData;
  yourWorks!: Templates;
  subs_templates_array: Subscription;
  constructor(private _userService: UserService) {
    YourWorks.next(true)
    this.subs_UserData_collector = this._userService
      .getUserData()
      .subscribe((data) => {
        this.UserData = data;
        this.yourWorks = this.yourWorks?.filter(
          (val) => val.user._id === data._id
        );
      });
    this.subs_templates_array = this._userService.getTemplates().subscribe(
      (templates: any) => {
        this.yourWorks = templates.all_templates;

        this.yourWorks = this.yourWorks?.filter(
          (val) => val.isPrivate == false && val.user._id == this.UserData._id
        );
        setTimeout(() => {
          if (this.yourWorks) {
            for (const el of this.yourWorks) {
              this.previewOfCode(el.template_id);
            }
          }
        }, 500);
      },
      (err) => {
        console.log('template data error: ', err);
      }
    );
  }

  // view templates
  subs_codePreview!: Subscription;
  previewOfCode(id: string) {
    const iframes: NodeListOf<HTMLIFrameElement> =
      document.querySelectorAll('.www');
    const iframeArray: HTMLIFrameElement[] = Array.from(iframes);
    this.subs_codePreview = this._userService.reloadIframe(id).subscribe(
      (response) => {
        const blob = new Blob([response], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        for (const el of iframeArray) {
          if (el.id == id) {
            el.src = url;
          }
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnDestroy(): void {
    YourWorks.next(false)
    this.subs_UserData_collector?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
  }
}
