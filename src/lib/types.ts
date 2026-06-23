export type ProductCardData = {
  id: string;
  slug: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  salePrice: number;
  stock: number;
  badge: string;
  reviewCount?: number;
};

export type CartItem = {
  productId: string;
  slug: string;
  title: string;
  artist: string;
  image: string;
  price: number;
  salePrice: number;
  version: string;
  quantity: number;
};
