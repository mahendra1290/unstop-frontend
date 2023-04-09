import { createSeatMap } from "./utils";

/**
 * Mark the bookedSeats as booked
 * @param bookedSeats booked tickets
 * @param coachSeats coach seats
 * @returns updated coach seats
 */
const markTicketBooked = (bookedSeats: number[], coachSeats: Seat[][]) => {
  const coachSeatsCopy = [...coachSeats];
  for (let i = 0; i < coachSeatsCopy.length; i++) {
    for (let j = 0; j < coachSeatsCopy[i].length; j++) {
      if (bookedSeats.includes(coachSeatsCopy[i][j].number)) {
        if (coachSeatsCopy[i][j].status === "reserved") {
          throw new Error("Error: can not reserve already reserved seat");
        }
        coachSeatsCopy[i][j].status = "reserved";
      }
    }
  }
  return coachSeatsCopy;
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
  for (let i = 0; i < seatsCopy.length; i++) {
    const row = [...seatsCopy[i]];
    const emptySeats = row.filter((seat) => seat.status === "available");
    const availableSeats = emptySeats.length;
    if (availableSeats >= seatsToBook) {
      for (let i = 0; i < seatsToBook; i++) {
        bookedSeats.push(emptySeats[i].number);
      }

      break;
    }
  }
  return bookedSeats.length ? bookedSeats : null;
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
