import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupSignupComponent } from './popup-signup.component';

describe('PopupSignupComponent', () => {
  let component: PopupSignupComponent;
  let fixture: ComponentFixture<PopupSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupSignupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopupSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
