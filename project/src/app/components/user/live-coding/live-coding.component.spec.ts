import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveCodingComponent } from './live-coding.component';

describe('LiveCodingComponent', () => {
  let component: LiveCodingComponent;
  let fixture: ComponentFixture<LiveCodingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LiveCodingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LiveCodingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
