import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, provideRouter, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const authServiceMock = {
    isAuthenticated: vi.fn()
  };

  beforeEach(() => {
    authServiceMock.isAuthenticated.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    });
  });

  function executeGuard() {
    return TestBed.runInInjectionContext(() => authGuard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot
    ));
  }

  it('should allow an authenticated user', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    expect(executeGuard()).toBe(true);
  });

  it('should redirect an unauthenticated user to login', () => {
    const router = TestBed.inject(Router);
    authServiceMock.isAuthenticated.mockReturnValue(false);

    expect(executeGuard()).toEqual(router.createUrlTree(['/login']));
  });
});
