import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { Templates } from 'src/app/types/template_types';
import { Trending } from '../home/home.component';

@Component({
  selector: 'app-trending',
  templateUrl: './trending.component.html',
  styleUrls: ['./trending.component.css'],
})
export class TrendingComponent implements OnDestroy {
  trendingTemplates!: Templates;
  subs_templates_array: Subscription;

  constructor(private _userService: UserService) {
    Trending.next(true)
    this.subs_templates_array = this._userService.getTemplates().subscribe(
      (templates: any) => {
        this.trendingTemplates = templates.all_templates;

        this.trendingTemplates = this.trendingTemplates?.filter(
          (val) => val.isPrivate == false
        );
        setTimeout(() => {
          if (this.trendingTemplates) {
            for (const el of this.trendingTemplates) {
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
    Trending.next(false)
    this.subs_templates_array?.unsubscribe();
    this.subs_codePreview?.unsubscribe();
  }
}
