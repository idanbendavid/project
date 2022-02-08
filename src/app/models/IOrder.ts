export interface IOrder {
  globalId: number;
  cartId: number;
  creditCard: number;
  finalPrice: number;
  shippingCity: string;
  shippingStreet: string;
  shippingDate: string;
  orderDate: string;
}

