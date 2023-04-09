export type Seat = {
  number: number;
  status: "available" | "reserved";
};

export type Coach = {
  totalSeats: number;
  seatsPerRow: number;
  reservedSeats: number[];
};
