import { TestBed } from '@angular/core/testing';

import { CodingGuard } from './coding.guard';

describe('CodingGuard', () => {
  let guard: CodingGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CodingGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
