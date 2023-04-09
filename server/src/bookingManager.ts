import { createSeatMap } from "./utils";

const canBookInSameRow = (seatsToBook: number, row: Seat[]) => {
  return (
    row.filter((seat) => seat.status === "available").length >= seatsToBook
  );
};

const reserveSeatsInRow = (
  seatsToBook: number,
  row: Seat[],
): { reservedSeats: number[]; closeness: number } => {
  const continuosSeats: number[][] = [];
  let i = 0;
  while (i < row.length) {
    const seats: number[] = [];
    while (i < row.length && row[i].status == "available") {
      seats.push(row[i].number);
      i++;
    }
    if (seats.length > 0) {
      continuosSeats.push(seats);
    }
    i++;
  }
  continuosSeats.sort((groupA, groupB) => groupB.length - groupA.length);
  let bookedSeats: number[] = [];
  let cost = 0;
  for (let group of continuosSeats) {
    if (bookedSeats.length < seatsToBook) {
      bookedSeats = bookedSeats.concat(
        group.slice(0, Math.min(seatsToBook, group.length)),
      );
      cost += 1;
    }
  }
  return { reservedSeats: bookedSeats, closeness: cost };
};

/**
 * Tries to book seats in the same row, returns booked ticket
 * numbers if available else return null
 * @param seatsToBook number of seats to book
 * @param coachSeats current coach seats
 * @returns booked seats if successull otherwise null
 */
const tryBookingInSameRow = (
  seatsToBook: number,
  coachSeats: Seat[][],
): number[] | null => {
  if (seatsToBook <= 0) {
    return [];
  }
  const seatsCopy = [...coachSeats];
  let bookedSeats: number[] = [];
  let minCloseness = 10000;
  for (let i = 0; i < seatsCopy.length; i++) {
    if (canBookInSameRow(seatsToBook, seatsCopy[i])) {
      const { reservedSeats, closeness } = reserveSeatsInRow(
        seatsToBook,
        seatsCopy[i],
      );
      if (closeness < minCloseness) {
        bookedSeats = reservedSeats;
        minCloseness = closeness;
      }
    }
  }
  return bookedSeats.length ? bookedSeats : null;
};

const bookSeats = (
  rowIndex: number,
  totalSeats: number,
  bookedSeats: number,
  seatMap: Seat[][],
): number => {
  if (rowIndex === bookSeats.length) {
    return 1000000;
  }
  if (totalSeats === bookedSeats) {
    return 0;
  }
  let c = 10000;
  for (let i = 0; i < 7; i++) {
    if (seatMap[rowIndex][i].status === "available") {
      seatMap[rowIndex][i].status = "reserved";
      const take = bookSeats(rowIndex, totalSeats, bookedSeats - 1, seatMap);
      const notTake = bookSeats(rowIndex, totalSeats, bookedSeats, seatMap);
      seatMap[rowIndex][i].status = "available";
      c = Math.min(c, Math.min(take, notTake));
    }
  }
  const n = bookSeats(rowIndex + 1, totalSeats, bookedSeats, seatMap);
  return Math.min(c, n);
};

const bookTickets = (
  seatsToBook: number,
  coach: Coach,
): { coachSeats: Coach; bookedSeats: number[] } => {
  const coachCopy = { ...coach };
  const coachSeats = createSeatMap(coach);
  const bookedSeats = tryBookingInSameRow(seatsToBook, coachSeats);
  if (bookedSeats) {
    return {
      coachSeats: {
        ...coach,
        reservedSeats: coachCopy.reservedSeats.concat(bookedSeats),
      },
      bookedSeats,
    };
  }
  return { coachSeats: coach, bookedSeats: [] };
};

export { bookTickets };
