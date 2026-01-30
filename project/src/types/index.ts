export interface FoodOrder {
  id?: string;
  user_name: string;
  user_email: string;
  order_date: string;
  meal_type: string;
  lunch_preference: string;
  lunch_type: string;
  dinner_preference: string;
  dinner_type: string;
  lunch_price: number;
  dinner_price: number;
  total_price: number;
  created_at?: string;
}

export interface TransportBooking {
  id?: string;
  user_name: string;
  user_email: string;
  booking_date: string;
  booking_type: 'pickup' | 'dropoff';
  shift_end_time?: string;
  gender?: string;
  route?: string;
  pickup_time?: string;
  pickup_address?: string;
  created_at?: string;
}

export type MealPreference = 'veg' | 'paneer' | 'chicken' | 'fish' | 'egg' | 'none';
export type LunchType = 'roti_only' | 'roti_rice_combined' | 'none';
export type DinnerType = 'roti_only' | 'roti_rice_combined' | 'none';

export const MEAL_PRICES: Record<string, number> = {
  veg: 93,
  paneer: 113,
  chicken: 113,
  fish: 103,
  egg: 98,
  none: 0,
};