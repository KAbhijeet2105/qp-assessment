import { GroceryItem } from './GroceryItem';
import { Order } from './Order';

export interface OrderItem {
  id?: number;
  order?: Order;
  orderId?: number;
  item?: GroceryItem;
  itemId?: number;
  quantity?: number;
}
