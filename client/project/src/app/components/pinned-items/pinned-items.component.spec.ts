import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PinnedItemsComponent } from './pinned-items.component';

describe('PinnedItemsComponent', () => {
  let component: PinnedItemsComponent;
  let fixture: ComponentFixture<PinnedItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PinnedItemsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PinnedItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
