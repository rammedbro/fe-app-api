export interface CreditCardPayment {
  method: 'credit-card';
  data: {
    number: string;
    expires: string;
    cvc: string;
  };
}

export interface PaypalPayment {
  method: 'paypal';
}

export interface BitcoinPayment {
  method: 'bitcoin';
}
