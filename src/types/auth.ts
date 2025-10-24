export interface Token {
  access_token: string;
  refresh_token: string;
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