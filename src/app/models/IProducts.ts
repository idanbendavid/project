export interface IProducts {
  productId?: number;
  name: string;
  categoryId?: number;
  categoryName?: string;
  pricePerUnit: number;
  image?: string;
  stock?: number;
  quantity : number;
  finalPrice: number;
  cartId: number
}
