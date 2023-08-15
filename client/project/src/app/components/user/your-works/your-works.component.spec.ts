import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourWorksComponent } from './your-works.component';

describe('YourWorksComponent', () => {
  let component: YourWorksComponent;
  let fixture: ComponentFixture<YourWorksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourWorksComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourWorksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
