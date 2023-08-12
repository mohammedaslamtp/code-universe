import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MainService } from 'src/app/services/main.service';
import { domain, currentUrl } from 'src/app/services/shared-values.service';
import { SocketService } from 'src/app/services/socket.service';
import { UserService } from 'src/app/services/user.service';
import { USerData } from 'src/app/types/UserData';
import { comment } from 'src/app/types/comment';
import { Template } from 'src/app/types/template_types';
import moment from 'moment';

@Component({
  selector: 'app-overall-view',
  templateUrl: './overall-view.component.html',
  styleUrls: ['./overall-view.component.css'],
})
export class OverallViewComponent implements OnInit, OnDestroy {
  pageLoading: boolean = false;
  tempId!: string;
  subs_tempId!: Subscription;
  currentUrl!: string;
  subs_currentUrl!: Subscription;
  tempDetails!: Template;
  subs_tempDetail!: Subscription;
  owner!: USerData;
  subs_owner!: Subscription;
  userData!: USerData;
  userId!: string;
  comments!: comment[];
  subs_comments!: Subscription;
  domain: string = domain;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _mainService: MainService,
    private _userService: UserService,
    private _socketService: SocketService
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    this._socketService.connect();

    // collecting current url
    this.subs_currentUrl = currentUrl.subscribe((url) => {
      if (url === 'empty') {
        this.currentUrl = '/';
      } else {
        this.currentUrl = url;
      }
    });

    // fetching account owner details
    this.subs_owner = this._userService.getUserData().subscribe(
      (data) => {
        this.owner = data;
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );

    this.subs_tempId = this._activateRoute.params.subscribe(
      (param) => {
        this.tempId = param['id'];
        this.subs_tempDetail = this._mainService
          .getTemplateDetail(param['id'])
          .subscribe((result) => {
            if (result.data) {
              this.userData = result.data.user;
              console.log('template details ', result.data);
              this.tempDetails = result.data;
              this.loadTemplate(result.data.template_id);
              this._socketService.emit('giveAllComments', {
                id: result.data._id,
              });
              this.pageLoading = false;
            }
          });
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );

    // fetching all comments
    this._socketService.on('allComments', (data) => {
      this.comments = data;
    });
  }

  // date and time setting up to moment.js
  timeSetUp(date: Date | string): string {
    return moment(date).fromNow();
  }

  @ViewChild('url', { static: false }) iframe!: ElementRef;
  Realoading: boolean = false;
  loadTemplate(id: string) {
    this.Realoading = true;
    this._userService.reloadIframe(id).subscribe((res) => {
      this.Realoading = false;
      const blob = new Blob([res], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const iframe: HTMLIFrameElement = this.iframe.nativeElement;
      iframe.src = url;
    });
  }

  replayTo: string | null = null;
  textAreaContent = '';

  addComment(form: NgForm) {
    let comment = form.controls['comment'].value;
    comment = comment.trim();
    this.textAreaContent = comment;
    if (String(comment).length > 0) {
      if (this.replayTo) {
        this._socketService.emit('addSubComment', {
          comment: comment,
          userId: this.owner._id,
          tempId: this.tempDetails._id,
        });
      } else {
        this._socketService.emit('addComment', {
          comment: comment,
          userId: this.owner._id,
          tempId: this.tempDetails._id,
        });
      }
    }
    this.textAreaContent = '';
    this.scrollToBottom();
  }

  deleteComment(id:string,tempId:string){
    this._socketService.emit('deleteComment',{id:id,tempId:tempId})
  }

  @ViewChild('commentArea', { static: false }) commentDiv!: ElementRef;
  scrollToBottom() {
    const container = this.commentDiv.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  subComment(comment: string) {
    this.replayTo = comment;
  }

  removeMention = () => (this.replayTo = null);

  ngOnDestroy(): void {
    this.subs_tempDetail?.unsubscribe();
    this.subs_tempId?.unsubscribe();
    this.subs_owner?.unsubscribe();
    this._socketService.disconnect();
    this.removeMention();
  }
}
