export interface UserProfile {
  id: string;
  name: string;
  email: string;
  aadhaarEncrypted: string; // Stored encrypted
  aadhaarDecrypted?: string; // Only available after secure fetch
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export interface ApiError {
  message: string;
  code?: string;
}

export enum AuthStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}