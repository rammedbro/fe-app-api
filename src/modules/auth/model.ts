export interface SignUpPayload {
  email: string;
  password: string;
}

export interface SignInPayload {
  username: string;
  password: string;
}

export interface Session {
  sid: string;
  expires: string;
  user: Express.User;
}
