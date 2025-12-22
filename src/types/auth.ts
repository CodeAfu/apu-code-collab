export interface Token {
  access_token: string;
  token_type: string;
}

export interface DecodedToken {
  id: string;
  sub: string;
  apu_id: string;
  role: string;
  type: "access" | "refresh";
  exp: number;
}

export interface AuthError {
  detail: {
    message: string;
    error_code: string;
    debug?: string;
  };
}
