import { TestBed } from '@angular/core/testing';

import { PathNavigatorSupportService } from './path-navigator-support.service';

describe('PathNavigatorSupportService', () => {
  let service: PathNavigatorSupportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PathNavigatorSupportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
