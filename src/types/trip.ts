export type TripStatus = "planning" | "completed";

export type ScheduleEvent = {
  time?: string;
  title: string;
  location?: string;
  memo?: string;
  transport?: string;
  url?: string;
  important?: boolean;
};

export type ScheduleDay = {
  date: string;
  label: string;
  events: ScheduleEvent[];
};

export type Room = {
  name: string;
  members: string[];
};

export type LinkItem = {
  label: string;
  url: string;
};

export type HotelHighlight = {
  name: string;
  description?: string;
  note?: string;
  details?: string[];
  url?: string;
};

export type Hotel = {
  name: string;
  stayDates: string[];
  checkIn?: string;
  checkOut?: string;
  address?: string;
  phone?: string;
  mapUrl?: string;
  officialUrl?: string;
  bookingName?: string;
  planName?: string;
  roomType?: string;
  priceNote?: string;
  rooms?: Room[];
  accessNotes?: string[];
  links?: LinkItem[];
  highlights?: HotelHighlight[];
  parkingMemo?: string;
  memo?: string;
};

export type ExpenseCategory =
  | "transport"
  | "hotel"
  | "food"
  | "activity"
  | "other";

export type Expense = {
  title: string;
  amount: number;
  paidBy: string;
  participants: string[];
  category?: ExpenseCategory;
  memo?: string;
};

export type MahjongRule = {
  rate: number;
  uma: [number, number, number, number];
  oka: number;
  startPoint: number;
  returnPoint: number;
};

export type MahjongPlayerResult = {
  name: string;
  point: number;
  rank?: number;
};

export type MahjongGame = {
  label: string;
  results: MahjongPlayerResult[];
};

export type MahjongData = {
  title: string;
  rule: MahjongRule;
  games: MahjongGame[];
};

export type Trip = {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  status: TripStatus;
  members: string[];
  summary?: string;
  schedule: ScheduleDay[];
  hotels: Hotel[];
  expenses: Expense[];
  mahjong?: MahjongData;
};
