export interface User {
  id: string;
  _id?: string;
  phone: string;
  email: string;
  displayName: string;
  profilePictureUrl: string | null;
  hasSetPassword: boolean;
  createdVia: string;
  aliasIds: string[];
  publicKey: string | null;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface SetupTokenResponse {
  setupToken: string;
  phone: string;
  email: string;
  isExistingUser: boolean;
}

export interface CheckUserResponse {
  exists: boolean;
  hasSetPassword: boolean;
}

const API_BASE = '/api';

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const errorMsg = data?.error || data?.message || `Request failed with status ${res.status}`;
    throw new Error(errorMsg);
  }
  return data as T;
}

export const api = {
  async checkUser(phone: string): Promise<CheckUserResponse> {
    const res = await fetch(`${API_BASE}/auth/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return handleResponse<CheckUserResponse>(res);
  },

  async requestSetupToken(phone: string): Promise<SetupTokenResponse> {
    const res = await fetch(`${API_BASE}/auth/setup-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone }),
    });
    return handleResponse<SetupTokenResponse>(res);
  },

  async setPassword(setupToken: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/set-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ setupToken, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async login(phone: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, password }),
    });
    return handleResponse<AuthResponse>(res);
  },

  async getMe(token: string): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse<{ user: User }>(res);
  },
};
