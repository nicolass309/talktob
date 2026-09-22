import { setDevToken } from './apiClient';

export function getClerkPublishableKey(): string | undefined {
  const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
  if (!key || key.includes('ZXhhbXBsZS1jbGVyay')) {
    return undefined;
  }
  return key;
}

export function isClerkEnabled(): boolean {
  return Boolean(getClerkPublishableKey());
}

export function setupDevAuth(): void {
  // En build de producción (import.meta.env.PROD), el token de dev se ignora siempre
  if (import.meta.env.PROD) {
    setDevToken(null);
    return;
  }

  if (import.meta.env.DEV && import.meta.env.VITE_DEV_AUTH_TOKEN) {
    setDevToken(import.meta.env.VITE_DEV_AUTH_TOKEN);
  }
}
