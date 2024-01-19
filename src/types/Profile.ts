export interface Profile {
  profileId: number;
  country: string;
  marketplace: string;
  belongToAccount: number;
  [key: string]: string | number;
}
