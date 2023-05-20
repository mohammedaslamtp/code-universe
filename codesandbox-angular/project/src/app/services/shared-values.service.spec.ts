import { TestBed } from '@angular/core/testing';

import { SharedValuesService } from './shared-values.service';

describe('SharedValuesService', () => {
  let service: SharedValuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedValuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
