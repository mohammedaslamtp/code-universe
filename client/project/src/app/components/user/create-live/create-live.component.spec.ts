import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLiveComponent } from './create-live.component';

describe('CreateLiveComponent', () => {
  let component: CreateLiveComponent;
  let fixture: ComponentFixture<CreateLiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLiveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
