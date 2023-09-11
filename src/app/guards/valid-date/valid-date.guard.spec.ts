import { TestBed } from '@angular/core/testing';

import { ValidDateGuard } from './valid-date.guard';

describe('ValidDateGuard', () => {
  let guard: ValidDateGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ValidDateGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
