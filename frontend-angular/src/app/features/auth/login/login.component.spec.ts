import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  const authServiceMock = {
    login: vi.fn()
  };

  beforeEach(async () => {
    authServiceMock.login.mockReset();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authServiceMock }
      ]
    }).compileComponents();
  });

  it('should redirect to the home page after a successful login', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    authServiceMock.login.mockReturnValue(of({ token: 'token-de-teste' }));
    component.loginForm.setValue({
      email: 'usuario@teste.com',
      password: '123456'
    });

    await component.onSubmit();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'usuario@teste.com',
      password: '123456'
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/home']);
  });

  it('should display the backend message when login fails', async () => {
    const fixture = TestBed.createComponent(LoginComponent);
    const component = fixture.componentInstance;
    authServiceMock.login.mockReturnValue(throwError(() => ({
      error: { message: 'Credenciais inválidas.' }
    })));
    component.loginForm.setValue({
      email: 'usuario@teste.com',
      password: 'invalida'
    });

    await component.onSubmit();

    expect(component.errorMessage).toBe('Credenciais inválidas.');
    expect(component.loading).toBe(false);
  });
});
