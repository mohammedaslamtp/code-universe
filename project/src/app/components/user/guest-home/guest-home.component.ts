import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Templates } from 'src/app/types/template_types';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-guest-home',
  templateUrl: './guest-home.component.html',
  styleUrls: ['./guest-home.component.css'],
  animations: [
    trigger('fade', [
      state('visible', style({ opacity: 1 })),
      state('hidden', style({ opacity: 0, display: 'none' })),
      transition('visible => hidden', animate('300ms ease-out')),
      transition('hidden => visible', animate('300ms ease-in')),
    ]),
  ],
})
export class GuestHomeComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  alert: boolean = false;
  allTemplates!: Templates;
  subs_templates!: Subscription;
  constructor(private _userService: UserService) {}
  ngOnInit(): void {
    this.isLoading = true;
    this.subs_templates = this._userService
      .getTemplates()
      .subscribe((data: any) => {
        if (data) {
          console.log('got result: ', data);
          this.allTemplates = data.all_templates;
          this.isLoading = false;
        }
      });

    setTimeout(() => {
      if (this.allTemplates) {
        for (const el of this.allTemplates) {
          this.previewOfCode(el.template_id);
        }
      }
    }, 100);
  }

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

  pleaseLogin() {
    console.log('login');
    this.alert = true;
  }
  closeAlert() {
    this.alert = false;
  }

  ngOnDestroy(): void {
    this.subs_templates?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
  }
}
