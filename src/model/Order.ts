import { User } from "./User";
import { OrderItem } from "./OrderItem";

export interface Order {
  id?: number;
  user?: User;
  userId?: number;
  createdAt?: Date;
  totalPrice?: number;
  orderStatus?: OrderStatus;
  items?: OrderItem[];
}

export enum OrderStatus {
  Placed = "placed",
  InProcess = "inProcess",
  Delivered = "delivered",
}
