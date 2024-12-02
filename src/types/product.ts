export type Product = {
  id: number;
  title: string;
  ingredients: string;
  description: string;
  price: number;
  image: string;
  isNew: boolean;
  discount: number;
  orderCount: number;
  isBlackFriday?: boolean;
  isChristmas?: boolean;
};