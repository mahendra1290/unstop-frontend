const bookTickets = (
  seatCount: number,
  seatMap: Seat[][],
): { seatMap: Seat[][]; bookedSeats: number[] } => {
  const seatsCopy = [...seatMap];
  let bookedSeats: number[] = [];
  for (let i = 0; i < seatsCopy.length; i++) {
    const row = [...seatsCopy[i]];
    const emptySeats = row.filter((seat) => seat.status === "vacant");
    if (emptySeats.length >= seatCount) {
      for (let i = 0; i < seatCount; i++) {
        emptySeats[i].status = "booked";
        bookedSeats.push(emptySeats[i].number);
      }

      break;
    }
  }
  return { seatMap: seatsCopy, bookedSeats };
};

export { bookTickets };
