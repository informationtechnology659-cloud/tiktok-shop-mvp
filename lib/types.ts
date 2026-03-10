export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: Category;
  rating: number;
  reviewCount: number;
  likes: number;
  imageUrl: string;
  tags?: string[];
}

export type Category = "Electronics" | "Fashion" | "Beauty" | "Home" | "Sports";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}
