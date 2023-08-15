import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestCodingComponent } from './guest-coding.component';

describe('GuestCodingComponent', () => {
  let component: GuestCodingComponent;
  let fixture: ComponentFixture<GuestCodingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuestCodingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GuestCodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
