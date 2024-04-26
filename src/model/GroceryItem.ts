import { OrderItem } from "./OrderItem";

export interface GroceryItem {
  id?: number;
  name: string;
  description?: string | null;
  price: number;
  quantity?: number;
  orders?: OrderItem[];
}
