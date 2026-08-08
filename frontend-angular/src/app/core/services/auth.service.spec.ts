import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    httpTesting = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpTesting.verify();
    localStorage.clear();
  });

  it('should send credentials and store the token after login', () => {
    const credentials = { email: 'usuario@teste.com', password: '123456' };

    service.login(credentials).subscribe();

    const request = httpTesting.expectOne('http://localhost:8080/api/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(credentials);
    request.flush({ token: 'token-de-teste' });

    expect(service.getToken()).toBe('token-de-teste');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should not create a session when login fails', () => {
    service.login({ email: 'usuario@teste.com', password: 'invalida' }).subscribe({
      error: () => undefined
    });

    const request = httpTesting.expectOne('http://localhost:8080/api/auth/login');
    request.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.isAuthenticated()).toBe(false);
  });

  it('should remove the token on logout', () => {
    localStorage.setItem('auth_token', 'token-de-teste');

    service.logout();

    expect(service.getToken()).toBeNull();
  });
});
