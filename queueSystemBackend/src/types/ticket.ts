export type TicketPrefix = "A" | "P";

export interface Ticket {
  id: string;
  prefix: TicketPrefix;
  number: number;
  deskNumber: number | undefined;
  createAt: number;
  servedAt: number | undefined;
}
