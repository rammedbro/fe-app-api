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

declare module 'express' {
  interface Express {
    plugin<T>(plugin: Plugin<T>, options: T): this;
  }
}

export {};
