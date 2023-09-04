import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowingCodesComponent } from './following-codes.component';

describe('FollowingCodesComponent', () => {
  let component: FollowingCodesComponent;
  let fixture: ComponentFixture<FollowingCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FollowingCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowingCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
