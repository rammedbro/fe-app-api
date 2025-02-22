declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      name?: string | null;
      lastname?: string | null;
      avatar?: string | null;
    }
  }
}

export {};
