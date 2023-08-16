import { TestBed } from '@angular/core/testing';

import { IsValidLiveGuard } from './is-valid-live.guard';

describe('IsValidLiveGuard', () => {
  let guard: IsValidLiveGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(IsValidLiveGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
