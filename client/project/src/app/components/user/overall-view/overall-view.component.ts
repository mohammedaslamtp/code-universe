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
import { SocialService } from 'src/app/services/soical.service';
import { DatePipe } from '@angular/common';

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
  commentLoading: boolean = false;
  likedUsers!: USerData[];
  LikesLoading: boolean = false;
  isFollowed!: boolean;

  constructor(
    private _activateRoute: ActivatedRoute,
    private _router: Router,
    private _mainService: MainService,
    private _userService: UserService,
    private _socketService: SocketService,
    private _socialService: SocialService,
    private _datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.pageLoading = true;
    this.commentLoading = true;
    this.LikesLoading = true;
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
          .subscribe(
            (result) => {
              if (result.data) {
                this._socketService.emit('joinCommentRoom', result.data._id);
                this.userData = result.data.user;
                if (result.data.user) {
                  result.data.user.followers.forEach((el: any) => {
                    if (el == this.owner._id) {
                      this.isFollowed = true;
                    } else {
                      this.isFollowed = false;
                    }
                  });
                }
                this.getLikedUsers(result.data._id);
                this.tempDetails = result.data;
                this.loadTemplate(result.data.template_id);
                this._socketService.emit('giveAllComments', {
                  id: result.data._id,
                });
                this.pageLoading = false;
              }
            },
            (e) => {
              this._router.navigate(['**']);
            }
          );
      },
      (err) => {
        this._router.navigate(['**']);
      }
    );

    // fetching all comments
    this._socketService.on('allComments', (data) => {
      this.comments = data;
      this.commentLoading = false;
    });

    // if like count upadate happens
    this._socketService.on('likeCountUpdated', (data) => {
      if (data.isChild) {
        this.comments.filter((el) => {
          if (el._id == data.fullDetails.subCommentOf) {
            el.subComment?.filter((sub) => {
              if (sub._id == data.fullDetails._id) {
                sub.like = data.fullDetails.like;
              }
            });
          }
        });
      } else {
        this.comments.filter((el) => {
          if (el._id == data.fullDetails._id) {
            el.like = data.fullDetails.like;
          }
        });
      }
    });
  }

  // date and time setting up to moment.js
  timeSetUp(date: Date | string): string {
    return moment(date).fromNow();
  }

  datePipeSetUp(date: Date | string) {
    return this._datePipe.transform(date, 'dd MMM yyyy, HH:mm:ss');
  }

  followLoading: boolean = false;
  followOrUnfollow(id: string) {
    this.followLoading = true;
    if (this.isFollowed) {
      this._socialService.unFollow(id).subscribe((result) => {
        this.isFollowed = false;
        this.followLoading = false;
      });
    } else {
      this._socialService.follow(id).subscribe((result) => {
        this.isFollowed = true;
        this.followLoading = false;
      });
    }
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

  textAreaContent = '';
  @ViewChild('commentField', { static: false }) commentField!: ElementRef;
  replayTo: string | null = null;
  parentId: string | null = null;
  replay(parentId: string, replayTo: string) {
    this.replayTo = replayTo;
    this.parentId = parentId;
    this.commentField.nativeElement.focus();
  }

  subs_likedUsers!: Subscription;
  likedUsersCount: number = 0;
  getLikedUsers(id: string) {
    this.subs_likedUsers = this._socialService
      .getLikedUsers(id)
      .subscribe((users) => {
        this.LikesLoading = false;
        this.likedUsers = users.data;
        this.likedUsersCount = users.data.length;
      });
  }

  addComment(form: NgForm) {
    let comment = form.controls['comment'].value;
    comment = comment.trim();
    this.textAreaContent = comment;
    if (String(comment).length > 0) {
      if (this.replayTo && this.parentId) {
        this._socketService.emit('addSubComment', {
          comment: comment,
          parentId: this.parentId,
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
    this.removeMention();
  }

  likeAndRemoveLike(id: string, isChild: boolean) {
    this._socketService.emit('adjustLike', {
      id: id,
      userId: this.owner._id,
      isChild: isChild,
    });
  }

  deleteComment(id: string, isChild: boolean, parentId?: string) {
    this._socketService.emit('deleteComment', {
      id: id,
      isChild: isChild,
      parentId: parentId,
    });
  }

  @ViewChild('commentArea', { static: false }) commentDiv!: ElementRef;
  scrollToBottom() {
    const container = this.commentDiv.nativeElement;
    container.scrollTop = container.scrollHeight;
  }

  removeMention = () => (this.replayTo = null);
  
  ngOnDestroy(): void {
    this._socketService.emit('leaveCommentRoom', this.tempId);
    this.subs_tempDetail?.unsubscribe();
    this.subs_tempId?.unsubscribe();
    this.subs_owner?.unsubscribe();
    this._socketService.disconnect();
    this.removeMention();
  }
}
