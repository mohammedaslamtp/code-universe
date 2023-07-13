import { TestBed } from '@angular/core/testing';

import { VerifyAdminGuard } from './verify-admin.guard';

describe('VerifyAdminGuard', () => {
  let guard: VerifyAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(VerifyAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
