export interface User {
  id?: number;
  username: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  backend_session_id?: string;
}

export interface SessionResponse {
  session_id: string;
}
