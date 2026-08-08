import {useCallback, useState} from 'react';

const TOKEN_KEY = 'auth_token';

function decodeToken(token: string) : {exp?: number} | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(
      payload.replace(
        /-/g, '+'
      ).replace(
        /_/g, '/')
    );
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

function isTokenValid(token: string | null): boolean {
  if (!token) return false;

  const payload = decodeToken(token);
  const exp = payload?.exp;

  if (!exp) return false;
  return exp * 1000 > Date.now();
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => isTokenValid(localStorage.getItem(TOKEN_KEY))
  );

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
}
