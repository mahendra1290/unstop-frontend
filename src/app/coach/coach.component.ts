import { Component, Input } from "@angular/core";
import { Coach, Seat } from "src/types";

@Component({
  selector: "app-coach",
  templateUrl: "./coach.component.html",
})
export class CoachComponent {
  @Input() set coach(coach: Coach | null) {
    this._coach = coach;
    const seatMap: Seat[][] = [];
    if (!coach) {
      return;
    }
    for (let i = 0; i < coach.totalSeats; i++) {
      if (i % coach.seatsPerRow === 0) {
        seatMap.push([]);
      }
      const isReserved = coach.reservedSeats.includes(i + 1);
      seatMap.at(-1)?.push({
        number: i + 1,
        status: isReserved ? "reserved" : "available",
      });
    }

    this.seatMap = seatMap;
  }

  @Input() bookedSeats: number[] = [];

  _coach: Coach | null = null;
  public seatMap: Seat[][] = [];
}
