import { TestBed } from '@angular/core/testing';

import { UserHomeGuard } from './user-home.guard';

describe('UserHomeGuard', () => {
  let guard: UserHomeGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UserHomeGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
