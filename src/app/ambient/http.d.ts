declare module 'node:http' {
  interface IncomingMessage {
    isAuthenticated: () => this is AuthenticatedRequest;
    user?: Express.User;
  }

  interface AuthenticatedRequest extends IncomingMessage {
    user: Express.User;
  }
}

export {};
