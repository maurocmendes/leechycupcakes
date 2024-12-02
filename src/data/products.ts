import { regularProducts } from "./products/regular-products";
import { specialProducts } from "./products/special-products";
import { promotionalProducts } from "./products/promotional-products";
import { seasonalProducts } from "./products/seasonal-products";
import { Product } from "@/types/product";

export const allProducts: Product[] = [
  ...regularProducts,
  ...specialProducts,
  ...promotionalProducts,
  ...seasonalProducts,
];