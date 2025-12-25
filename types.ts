export interface Record {
  id: string;
  amount: number;
  note: string;
  timestamp: number; // Unix timestamp
}

export interface DashboardStats {
  totalRevenue: number;
  transactionCount: number;
  carbonEmissions: number;
}