import { TestBed } from '@angular/core/testing';

import { SocialService } from './soical.service';

describe('SoicalService', () => {
  let service: SocialService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
