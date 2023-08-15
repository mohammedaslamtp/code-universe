import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicCodesComponent } from './public-codes.component';

describe('PublicCodesComponent', () => {
  let component: PublicCodesComponent;
  let fixture: ComponentFixture<PublicCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublicCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
