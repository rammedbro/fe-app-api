export interface Session {
  sid: string;
  expires: string;
  user: Express.User;
}
