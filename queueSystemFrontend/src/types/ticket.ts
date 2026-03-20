export interface Ticket {
  id: string;
  prefix: string;
  number: number;
  deskNumber: number | undefined;
  createdAt: number;
  servedAt: number | undefined;
}
