export class ApiError extends Error {
  status: number;
  code: string;
  details?: any;

  constructor(status: number, code: string, message: string, details?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

type TokenGetter = () => Promise<string | null>;

let currentTokenGetter: TokenGetter | null = null;
let devTokenFallback: string | null = null;

export function setTokenGetter(getter: TokenGetter | null) {
  currentTokenGetter = getter;
}

export function setDevToken(token: string | null) {
  devTokenFallback = token;
}

export async function getAuthToken(): Promise<string | null> {
  if (currentTokenGetter) {
    try {
      const token = await currentTokenGetter();
      if (token) return token;
    } catch (e) {
      console.warn('Error obtaining token from Clerk tokenGetter:', e);
    }
  }

  if (devTokenFallback) {
    return devTokenFallback;
  }

  return null;
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (!(options.body instanceof FormData) && !headers['Content-Type'] && options.body) {
    headers['Content-Type'] = 'application/json';
  }

  const token = await getAuthToken();
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorJson: any = null;
    try {
      errorJson = await response.json();
    } catch {
      // Response body wasn't JSON
    }

    const errDetail = errorJson?.error;
    const code = errDetail?.code || `HTTP_${response.status}`;
    const message = errDetail?.message || response.statusText || 'Error de comunicación con el backend';
    const details = errDetail?.details;

    throw new ApiError(response.status, code, message, details);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return await response.json();
}
