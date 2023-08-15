import { TestBed } from '@angular/core/testing';

import { GuestUserGuard } from './guest-user.guard';

describe('GuestUserGuard', () => {
  let guard: GuestUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuestUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
