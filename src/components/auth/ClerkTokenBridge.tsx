import React, { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { setTokenGetter } from '../../services/apiClient';

export const ClerkTokenBridge: React.FC = () => {
  const { getToken, isSignedIn } = useAuth();

  useEffect(() => {
    setTokenGetter(async () => {
      if (isSignedIn) {
        try {
          return await getToken();
        } catch {
          return null;
        }
      }
      return null;
    });
  }, [getToken, isSignedIn]);

  return null;
};
