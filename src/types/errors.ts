export interface ValidationError {
  message: string;
  details: {
    [name: string]: {
      message: string;
      value?: any;
    }
  };
}
