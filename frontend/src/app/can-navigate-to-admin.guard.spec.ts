import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canNavigateToAdminGuard } from './can-navigate-to-admin.guard';

describe('canNavigateToAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canNavigateToAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
