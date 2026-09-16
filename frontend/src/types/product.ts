export interface Product {
  id: number;
  name: string;
  category: "Electronics" | "Hardware" | "Software" | "Accessories" | string;
  group: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  icon: string;
  image: string;
  specs: string;
  stock: string;
  badge: string;
  requestOnly?: boolean;
}

export interface ProductCategory {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: string;
  path: string;
}
