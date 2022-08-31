import { Product } from './product';

export interface ApiResponse {
  limit: number;
  skip: number;
  total: number;
  products: Product[];
}
