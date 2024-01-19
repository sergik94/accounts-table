export interface Campaign {
  campaignId: number;
  clicks: number;
  cost: number;
  date: string;
  belongToProfile: number;
  [key: string]: string | number;
}
