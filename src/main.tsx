import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import './styles/global.css';
import App from './App.tsx';
import { getClerkPublishableKey, isClerkEnabled, setupDevAuth } from './services/authMode.ts';
import { ClerkTokenBridge } from './components/auth/ClerkTokenBridge.tsx';

const rootElement = document.getElementById('root')!;
const clerkKey = getClerkPublishableKey();

if (isClerkEnabled() && clerkKey) {
  createRoot(rootElement).render(
    <StrictMode>
      <ClerkProvider publishableKey={clerkKey}>
        <ClerkTokenBridge />
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
} else {
  setupDevAuth();
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
