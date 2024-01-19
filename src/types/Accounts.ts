export interface Account {
  accountId: number;
  email: string;
  authToken: string;
  creationDate: string;
  [key: string]: string | number;
}
