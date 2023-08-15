import { TestBed } from '@angular/core/testing';

import { LiveCodingGuard } from './live-coding.guard';

describe('LiveCodingGuard', () => {
  let guard: LiveCodingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LiveCodingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
