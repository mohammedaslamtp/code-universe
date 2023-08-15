import { TestBed } from '@angular/core/testing';

import { BlockUserGuard } from './block-user.guard';

describe('BlockUserGuard', () => {
  let guard: BlockUserGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(BlockUserGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
