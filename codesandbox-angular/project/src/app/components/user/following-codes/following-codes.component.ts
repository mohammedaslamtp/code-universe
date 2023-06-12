import { Component, OnDestroy } from '@angular/core';
import { Templates } from 'src/app/types/template_types';
import { Following } from '../home/home.component';

@Component({
  selector: 'app-following-codes',
  templateUrl: './following-codes.component.html',
  styleUrls: ['./following-codes.component.css'],
})
export class FollowingCodesComponent implements OnDestroy {
  followingCodes!: Templates;
  constructor() {
    Following.next(true);
  }
  ngOnDestroy(): void {
    Following.next(false);
  }
}
