import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateCodesComponent } from './private-codes.component';

describe('PrivateCodesComponent', () => {
  let component: PrivateCodesComponent;
  let fixture: ComponentFixture<PrivateCodesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivateCodesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrivateCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
