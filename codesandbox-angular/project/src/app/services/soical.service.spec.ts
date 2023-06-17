import { TestBed } from '@angular/core/testing';

import { SoicalService } from './soical.service';

describe('SoicalService', () => {
  let service: SoicalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoicalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
